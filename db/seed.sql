INSERT INTO foods (type, name, description, image_url, cuisine_type, dietary_tags, price_range, rating)
VALUES
  (
    'restaurant', 'Bella Italia',
    'Cozy Italian trattoria known for handmade pasta and wood-fired pizza.',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600',
    ARRAY['Italian'], ARRAY['vegetarian-options'], 2, 4.5
  ),
  (
    'restaurant', 'Taco Fiesta',
    'Vibrant Mexican cantina with street-style tacos and fresh guacamole.',
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600',
    ARRAY['Mexican'], ARRAY['gluten-free-options'], 1, 4.2
  ),
  (
    'recipe', 'Spaghetti Carbonara',
    'Classic Roman pasta with eggs, pecorino, guanciale, and black pepper.',
    'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600',
    ARRAY['Italian'], ARRAY[''], 2, 4.8
  ),
  (
    'recipe', 'Veggie Stir-Fry',
    'Quick wok-tossed vegetables in a savory ginger-garlic sauce.',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600',
    ARRAY['Asian'], ARRAY['vegan', 'gluten-free'], 1, 4.0
  );
