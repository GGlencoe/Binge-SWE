INSERT INTO public.foods (external_id, type, name, description, image_url, cuisine_type, dietary_tags, price_range, rating, location)
VALUES
  (
    'seed-rest-001', 'restaurant', 'Bella Italia', 'Cozy Italian trattoria downtown.',
    'https://example.com/images/bella-italia.jpg',
    ARRAY['italian'], ARRAY['vegetarian-options'], 2, 4.5,
    '{"lat": 38.6270, "lng": -90.1994, "address": "123 Market St, St. Louis, MO"}'::jsonb
  ),
  (
    'seed-rest-002', 'restaurant', 'Taco Fiesta', 'Authentic Mexican street tacos.',
    'https://example.com/images/taco-fiesta.jpg',
    ARRAY['mexican'], ARRAY['gluten-free-options'], 1, 4.2,
    '{"lat": 38.6312, "lng": -90.2001, "address": "456 Grand Ave, St. Louis, MO"}'::jsonb
  ),
  (
    'seed-recipe-001', 'recipe', 'Spaghetti Carbonara', 'Classic Roman pasta with egg, pecorino, and guanciale.',
    'https://example.com/images/carbonara.jpg',
    ARRAY['italian'], ARRAY[]::text[], 2, 4.8, NULL
  ),
  (
    'seed-recipe-002', 'recipe', 'Veggie Stir-Fry', 'Quick wok-tossed vegetables with garlic sauce.',
    'https://example.com/images/stir-fry.jpg',
    ARRAY['asian'], ARRAY['vegan', 'gluten-free'], 1, 4.0, NULL
  )
ON CONFLICT (external_id) DO NOTHING;
