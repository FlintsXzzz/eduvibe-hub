
-- Add balance column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS balance integer NOT NULL DEFAULT 100;

-- Create market_items table
CREATE TABLE public.market_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id uuid NOT NULL REFERENCES public.profiles(id),
  title text NOT NULL,
  description text,
  price integer NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'Snack' CHECK (category IN ('Snack', 'Service', 'Digital')),
  stock integer NOT NULL DEFAULT 1,
  image_url text,
  is_from_portfolio boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.market_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active items" ON public.market_items
  FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Sellers can insert own items" ON public.market_items
  FOR INSERT TO authenticated WITH CHECK (seller_id = auth.uid());
CREATE POLICY "Sellers can update own items" ON public.market_items
  FOR UPDATE TO authenticated USING (seller_id = auth.uid());
CREATE POLICY "Sellers can delete own items" ON public.market_items
  FOR DELETE TO authenticated USING (seller_id = auth.uid());
CREATE POLICY "Admins can manage all items" ON public.market_items
  FOR ALL TO authenticated USING (has_role('admin'::app_role));

-- Create transactions table
CREATE TABLE public.transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id uuid NOT NULL REFERENCES public.profiles(id),
  seller_id uuid NOT NULL REFERENCES public.profiles(id),
  item_id uuid REFERENCES public.market_items(id),
  amount integer NOT NULL,
  type text NOT NULL DEFAULT 'Purchase' CHECK (type IN ('Purchase', 'Reward', 'Transfer')),
  status text NOT NULL DEFAULT 'Success' CHECK (status IN ('Success', 'Pending')),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT TO authenticated
  USING (buyer_id = auth.uid() OR seller_id = auth.uid() OR has_role('teacher'::app_role) OR has_role('admin'::app_role));
CREATE POLICY "Users can insert transactions" ON public.transactions
  FOR INSERT TO authenticated
  WITH CHECK (buyer_id = auth.uid());

-- Create notifications table
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id),
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'Achievement' CHECK (type IN ('Achievement', 'Market', 'Admin')),
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (true);

-- RPC for buying items (atomic transaction)
CREATE OR REPLACE FUNCTION public.buy_item(
  _item_id uuid,
  _buyer_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _item market_items%ROWTYPE;
  _buyer_balance integer;
  _tx_id uuid;
BEGIN
  -- Verify buyer is the current user
  IF _buyer_id != auth.uid() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- Get item with lock
  SELECT * INTO _item FROM market_items WHERE id = _item_id AND is_active = true FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Item not found');
  END IF;

  IF _item.stock <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Out of stock');
  END IF;

  -- Prevent buying own item
  IF _item.seller_id = _buyer_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot buy your own item');
  END IF;

  -- Check buyer balance
  SELECT balance INTO _buyer_balance FROM profiles WHERE id = _buyer_id FOR UPDATE;
  IF _buyer_balance < _item.price THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient balance');
  END IF;

  -- Deduct from buyer
  UPDATE profiles SET balance = balance - _item.price WHERE id = _buyer_id;
  -- Add to seller
  UPDATE profiles SET balance = balance + _item.price WHERE id = _item.seller_id;
  -- Reduce stock
  UPDATE market_items SET stock = stock - 1 WHERE id = _item_id;

  -- Log transaction
  INSERT INTO transactions (buyer_id, seller_id, item_id, amount, type, status)
  VALUES (_buyer_id, _item.seller_id, _item_id, _item.price, 'Purchase', 'Success')
  RETURNING id INTO _tx_id;

  -- Notify buyer
  INSERT INTO notifications (user_id, title, message, type)
  VALUES (_buyer_id, 'Purchase Successful', 'You bought "' || _item.title || '" for ' || _item.price || ' coins', 'Market');

  -- Notify seller
  INSERT INTO notifications (user_id, title, message, type)
  VALUES (_item.seller_id, 'Item Sold!', '"' || _item.title || '" was purchased for ' || _item.price || ' coins', 'Market');

  RETURN jsonb_build_object('success', true, 'transaction_id', _tx_id, 'item_title', _item.title, 'price', _item.price);
END;
$$;
