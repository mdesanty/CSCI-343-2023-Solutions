DROP DATABASE IF EXISTS recipes_db;
CREATE DATABASE recipes_db;

\c recipes_db

DROP TABLE IF EXISTS recipes;
CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  ingredient_1 VARCHAR(100) NOT NULL,
  ingredient_2 VARCHAR(100),
  ingredient_3 VARCHAR(100),
  recipe_author_first_name VARCHAR(100) NOT NULL,
  recipe_author_last_name VARCHAR(100) NOT NULL,
  recipe_category_name VARCHAR(100) NOT NULL
);

INSERT INTO recipes
  (name, ingredient_1, ingredient_2, ingredient_3, recipe_author_first_name, recipe_author_last_name, recipe_category_name)
VALUES
  ('Chicken Parm', 'Chicken', 'Sauce', 'Cheese', 'Jonny', 'Pastaman', 'Italian'),
  ('Smoothie', 'Yogurt', 'Fruit', 'Ice', 'Billy', 'Banner', 'Beverages'),
  ('Tacos', 'Taco Shells', 'Cheese', 'Beef', 'Tony', 'Ferrulo', 'TexMex'),
  ('Sandwitch', 'Bread', 'Mayo', 'Deli Meat', 'Jake', 'Grancho', 'Lunch'),
  ('Sundae', 'Ice Cream', 'Fudge', 'Whipped Cream', 'Mike', 'DeSanty', 'Desserts');