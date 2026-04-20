-- ── Restaurants ──────────────────────────────────────────────────────────────
INSERT INTO restaurants (name, description, image_url, cuisine_type, dietary_tags, price_range, rating)
VALUES
  ('Bella Italia', 'Cozy Italian trattoria known for handmade pasta and wood-fired pizza.', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600', ARRAY['Italian'], ARRAY['vegetarian-options'], 2, 4.5),
  ('Taco Fiesta', 'Vibrant Mexican cantina with street-style tacos and fresh guacamole.', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600', ARRAY['Mexican'], ARRAY['gluten-free-options'], 1, 4.2),
  ('Nobu', 'World-famous Japanese fusion and sushi bar.', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600', ARRAY['Japanese'], ARRAY[]::text[], 4, 4.7),
  ('Shake Shack', 'Premium smash burgers, crinkle fries, and frozen custard.', 'https://images.unsplash.com/photo-1561758033-7e924f619b47?w=600', ARRAY['American'], ARRAY[]::text[], 1, 4.3),
  ('Chipotle', 'Build-your-own burritos and bowls with fresh ingredients.', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600', ARRAY['Mexican'], ARRAY['gluten-free-options'], 1, 4.1),
  ('The Cheesecake Factory', 'Massive menu with over 250 dishes and epic cheesecakes.', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600', ARRAY['American'], ARRAY['vegetarian-options'], 2, 4.0),
  ('Benihana', 'Theatrical teppanyaki dining with live hibachi chefs.', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600', ARRAY['Japanese'], ARRAY[]::text[], 3, 4.4),
  ('In-N-Out Burger', 'West Coast cult classic with a secret menu.', 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=600', ARRAY['American'], ARRAY[]::text[], 1, 4.6),
  ('Dishoom', 'Beloved Bombay-style café serving Iranian chai and slow-cooked dals.', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600', ARRAY['Indian'], ARRAY['vegetarian-options'], 2, 4.8),
  ('Zuma', 'Contemporary Japanese izakaya with a stunning robata grill.', 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600', ARRAY['Japanese'], ARRAY['gluten-free-options'], 4, 4.6),
  ('Le Bernardin', 'Three-Michelin-star French seafood institution in New York.', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600', ARRAY['French'], ARRAY['gluten-free-options'], 4, 4.9),
  ('Panda Express', 'Fast-casual Chinese-American with orange chicken and fried rice.', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600', ARRAY['Chinese'], ARRAY[]::text[], 1, 3.8),
  ('Nando''s', 'Portuguese-inspired flame-grilled peri-peri chicken chain.', 'https://images.unsplash.com/photo-1598514982901-cfb3929f4b9f?w=600', ARRAY['Mediterranean'], ARRAY['gluten-free-options'], 1, 4.3),
  ('Din Tai Fung', 'Legendary Taiwanese chain famous for xiao long bao soup dumplings.', 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600', ARRAY['Chinese'], ARRAY[]::text[], 2, 4.7),
  ('True Food Kitchen', 'Health-driven seasonal menu built on anti-inflammatory principles.', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600', ARRAY['Mediterranean'], ARRAY['vegan', 'gluten-free'], 2, 4.4);

-- ── Recipes & Dishes ──────────────────────────────────────────────────────────
INSERT INTO foods (type, name, description, image_url, cuisine_type, dietary_tags, price_range, rating)
VALUES
  -- Italian (5 items — strong cluster for algorithm testing)
  ('recipe', 'Spaghetti Carbonara', 'Classic Roman pasta with eggs, pecorino, guanciale, and cracked black pepper.', 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600', ARRAY['Italian'], ARRAY[]::text[], 2, 4.8),
  ('recipe', 'Margherita Pizza', 'Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, and basil.', 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600', ARRAY['Italian'], ARRAY['vegetarian'], 2, 4.6),
  ('recipe', 'Mushroom Risotto', 'Creamy Arborio rice with porcini mushrooms, white wine, and parmesan.', 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600', ARRAY['Italian'], ARRAY['vegetarian', 'gluten-free'], 2, 4.5),
  ('recipe', 'Chicken Piccata', 'Tender chicken breast in a bright lemon-caper butter sauce.', 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600', ARRAY['Italian'], ARRAY['gluten-free'], 2, 4.4),
  ('dish', 'Tiramisu', 'Espresso-soaked ladyfingers layered with mascarpone cream and cocoa.', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600', ARRAY['Italian'], ARRAY['vegetarian'], 2, 4.9),

  -- Mexican (4 items)
  ('recipe', 'Chicken Tacos', 'Crispy chicken with fresh salsa, lime crema, and pickled jalapeños.', 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600', ARRAY['Mexican'], ARRAY['gluten-free-options'], 1, 4.3),
  ('recipe', 'Beef Enchiladas', 'Corn tortillas filled with braised beef and smothered in ancho chile sauce.', 'https://images.unsplash.com/photo-1534352956036-cd81e27dd615?w=600', ARRAY['Mexican'], ARRAY[]::text[], 1, 4.2),
  ('recipe', 'Guacamole', 'Fresh avocado mashed with lime, cilantro, white onion, and serrano.', 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600', ARRAY['Mexican'], ARRAY['vegan', 'gluten-free'], 1, 4.5),
  ('recipe', 'Chicken Burrito Bowl', 'Cilantro-lime rice topped with grilled chicken, black beans, pico, and sour cream.', 'https://images.unsplash.com/photo-1640525535434-31deabc40893?w=600', ARRAY['Mexican'], ARRAY['gluten-free'], 1, 4.3),

  -- Japanese (4 items)
  ('recipe', 'Salmon Sushi', 'Fresh salmon nigiri with seasoned rice, soy sauce, and wasabi.', 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600', ARRAY['Japanese'], ARRAY['gluten-free'], 3, 4.7),
  ('recipe', 'Tonkotsu Ramen', 'Rich pork-bone broth with chashu, soft egg, nori, and springy noodles.', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600', ARRAY['Japanese'], ARRAY[]::text[], 2, 4.8),
  ('recipe', 'Chicken Gyoza', 'Pan-fried dumplings with a crispy bottom, filled with chicken and cabbage.', 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600', ARRAY['Japanese'], ARRAY[]::text[], 1, 4.4),
  ('recipe', 'Miso Glazed Salmon', 'Salmon fillet marinated in white miso, mirin, and sake, broiled until caramelised.', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600', ARRAY['Japanese'], ARRAY['gluten-free'], 3, 4.6),

  -- Indian (4 items)
  ('recipe', 'Butter Chicken', 'Tender chicken in a rich, spiced tomato cream sauce served with basmati rice.', 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600', ARRAY['Indian'], ARRAY['gluten-free'], 2, 4.5),
  ('recipe', 'Palak Paneer', 'Creamy spinach curry with cubes of fresh paneer and warming spices.', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600', ARRAY['Indian'], ARRAY['vegetarian', 'gluten-free'], 1, 4.3),
  ('recipe', 'Chicken Biryani', 'Fragrant basmati layered with spiced chicken, caramelised onions, and saffron.', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600', ARRAY['Indian'], ARRAY['gluten-free'], 2, 4.7),
  ('recipe', 'Dal Makhani', 'Black lentils slow-cooked overnight in butter, cream, and tomato.', 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=600', ARRAY['Indian'], ARRAY['vegetarian', 'gluten-free'], 1, 4.4),

  -- Chinese (4 items)
  ('recipe', 'Kung Pao Chicken', 'Stir-fried chicken with peanuts, dried chilies, and Sichuan peppercorns.', 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600', ARRAY['Chinese'], ARRAY['gluten-free-options'], 1, 4.4),
  ('recipe', 'Pork Dumplings', 'Hand-folded pork and ginger dumplings steamed and served with black vinegar dip.', 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600', ARRAY['Chinese'], ARRAY[]::text[], 1, 4.5),
  ('recipe', 'Yang Chow Fried Rice', 'Classic fried rice with shrimp, char siu pork, eggs, and scallions.', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600', ARRAY['Chinese'], ARRAY['gluten-free-options'], 1, 4.2),
  ('recipe', 'Mapo Tofu', 'Silken tofu in a fiery Sichuan sauce of doubanjiang, minced pork, and numbing peppercorns.', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600', ARRAY['Chinese'], ARRAY['gluten-free'], 1, 4.3),

  -- Thai (3 items)
  ('recipe', 'Pad Thai', 'Stir-fried rice noodles with shrimp, bean sprouts, peanuts, and tamarind.', 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600', ARRAY['Thai'], ARRAY['gluten-free-options'], 1, 4.2),
  ('recipe', 'Green Curry', 'Creamy coconut milk curry with vegetables, Thai basil, and fragrant green paste.', 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600', ARRAY['Thai'], ARRAY['vegan', 'gluten-free'], 1, 4.5),
  ('recipe', 'Tom Yum Soup', 'Hot and sour lemongrass broth with shrimp, mushrooms, galangal, and kaffir lime.', 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600', ARRAY['Thai'], ARRAY['gluten-free'], 1, 4.3),

  -- Mediterranean (3 items)
  ('recipe', 'Greek Salad', 'Crisp cucumbers, tomatoes, kalamata olives, and feta with lemon-oregano dressing.', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600', ARRAY['Mediterranean'], ARRAY['vegetarian', 'gluten-free'], 1, 4.0),
  ('recipe', 'Shakshuka', 'Eggs poached in a spiced tomato and pepper sauce, served with crusty bread.', 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=600', ARRAY['Mediterranean'], ARRAY['vegetarian', 'gluten-free'], 1, 4.6),
  ('recipe', 'Lamb Shawarma', 'Slow-roasted spiced lamb wrapped in flatbread with tahini and pickled turnips.', 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600', ARRAY['Mediterranean'], ARRAY[]::text[], 1, 4.4),

  -- American (4 items)
  ('recipe', 'Beef Burger', 'Juicy smash burger with American cheese, pickles, onion, and secret sauce.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600', ARRAY['American'], ARRAY[]::text[], 1, 4.4),
  ('recipe', 'BBQ Baby Back Ribs', 'Slow-smoked pork ribs glazed with a tangy house BBQ sauce.', 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600', ARRAY['American'], ARRAY['gluten-free'], 2, 4.6),
  ('recipe', 'Mac and Cheese', 'Baked macaroni in a three-cheese sauce with a golden breadcrumb crust.', 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600', ARRAY['American'], ARRAY['vegetarian'], 1, 4.5),
  ('recipe', 'Avocado Toast', 'Sourdough with smashed avocado, everything bagel seasoning, and a poached egg.', 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=600', ARRAY['American'], ARRAY['vegetarian'], 1, 4.1),

  -- French (3 items)
  ('recipe', 'Coq au Vin', 'Chicken braised slowly in red wine with pearl onions, lardons, and mushrooms.', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600', ARRAY['French'], ARRAY['gluten-free'], 3, 4.7),
  ('recipe', 'Croque Monsieur', 'Grilled ham and Gruyère sandwich topped with bubbling béchamel.', 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=600', ARRAY['French'], ARRAY[]::text[], 2, 4.3),
  ('dish', 'Crème Brûlée', 'Silky vanilla custard with a perfectly caramelised sugar crust.', 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600', ARRAY['French'], ARRAY['vegetarian', 'gluten-free'], 2, 4.8),

  -- Misc dishes
  ('dish', 'Chocolate Lava Cake', 'Warm chocolate cake with a molten dark chocolate center, served with vanilla ice cream.', 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600', ARRAY['Dessert'], ARRAY['vegetarian'], 2, 4.9),
  ('dish', 'Truffle Fries', 'Crispy shoestring fries tossed with truffle oil, parmesan, and fresh herbs.', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600', ARRAY['American'], ARRAY['vegetarian', 'gluten-free'], 2, 4.5);
