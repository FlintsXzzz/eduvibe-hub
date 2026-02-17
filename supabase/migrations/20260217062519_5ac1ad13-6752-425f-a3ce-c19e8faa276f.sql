-- Drop both overloads and recreate them with correct table references
DROP FUNCTION IF EXISTS public.buy_item(uuid, uuid);
DROP FUNCTION IF EXISTS public.buy_item(uuid, uuid, integer);

CREATE OR REPLACE FUNCTION public.buy_item(_item_id uuid, _buyer_id uuid, _quantity integer DEFAULT 1)
RETURNS TABLE(transaction_id uuid, new_balance numeric, remaining_stock integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp', 'pg_catalog'
AS $$
DECLARE
  v_price numeric;
  v_stock integer;
  v_balance numeric;
  v_total numeric;
  v_seller_id uuid;
  v_txn_id uuid;
BEGIN
  IF _quantity IS NULL OR _quantity <= 0 THEN
    RAISE EXCEPTION 'Quantity must be a positive integer';
  END IF;

  -- Lock item row
  SELECT mi.price, mi.stock, mi.seller_id INTO v_price, v_stock, v_seller_id
  FROM public.market_items mi
  WHERE mi.id = _item_id AND mi.is_active = true
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Item not found or inactive';
  END IF;

  IF v_stock < _quantity THEN
    RAISE EXCEPTION 'Insufficient stock';
  END IF;

  v_total := v_price * _quantity;

  -- Lock buyer profile
  SELECT p.balance INTO v_balance
  FROM public.profiles p
  WHERE p.id = _buyer_id
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Buyer profile not found';
  END IF;

  IF v_balance < v_total THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  -- Deduct from buyer
  UPDATE public.profiles SET balance = balance - v_total WHERE id = _buyer_id;

  -- Add to seller
  UPDATE public.profiles SET balance = balance + v_total WHERE id = v_seller_id;

  -- Decrement stock
  UPDATE public.market_items SET stock = stock - _quantity WHERE id = _item_id;

  -- Insert transaction
  INSERT INTO public.transactions (buyer_id, seller_id, item_id, amount, type, status)
  VALUES (_buyer_id, v_seller_id, _item_id, v_total, 'Purchase', 'Success')
  RETURNING id INTO v_txn_id;

  -- Return
  transaction_id := v_txn_id;
  SELECT p.balance INTO new_balance FROM public.profiles p WHERE p.id = _buyer_id;
  SELECT mi.stock INTO remaining_stock FROM public.market_items mi WHERE mi.id = _item_id;
  RETURN NEXT;
END;
$$;