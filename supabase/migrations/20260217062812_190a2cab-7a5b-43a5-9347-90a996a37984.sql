-- Insert cafeteria items as market_items with category 'Snack'
-- Using the existing test student as seller for now (admin should manage these)
INSERT INTO public.market_items (title, description, price, category, stock, seller_id, is_from_portfolio, is_active)
SELECT title, description, price, 'Snack', stock, seller_id, false, true
FROM (VALUES
  ('Fresh Smoothie', 'Refreshing fruit smoothie', 8, 50, 'ddf60ab3-d073-42c1-9a4d-65d364d28fc4'::uuid),
  ('Sandwich', 'Classic deli sandwich', 12, 50, 'ddf60ab3-d073-42c1-9a4d-65d364d28fc4'::uuid),
  ('Fruit Bowl', 'Fresh seasonal fruits', 6, 50, 'ddf60ab3-d073-42c1-9a4d-65d364d28fc4'::uuid),
  ('Pasta', 'Creamy pasta dish', 15, 50, 'ddf60ab3-d073-42c1-9a4d-65d364d28fc4'::uuid)
) AS v(title, description, price, stock, seller_id)
WHERE NOT EXISTS (SELECT 1 FROM public.market_items WHERE market_items.title = v.title AND market_items.category = 'Snack');