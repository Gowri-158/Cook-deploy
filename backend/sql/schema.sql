CREATE DATABASE IF NOT EXISTS cookshare;
USE cookshare;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  oauth_provider VARCHAR(40),
  oauth_id VARCHAR(190),
  role ENUM('USER','ADMIN') DEFAULT 'USER',
  bio TEXT,
  profile_image VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recipes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  title_ta VARCHAR(200),
  description TEXT,
  description_ta TEXT,
  cuisine VARCHAR(80) NOT NULL,
  meal_type VARCHAR(80),
  difficulty ENUM('Easy','Medium','Hard') DEFAULT 'Easy',
  prep_minutes INT DEFAULT 0,
  cook_minutes INT DEFAULT 0,
  servings INT DEFAULT 1,
  image_url VARCHAR(1000),
  video_url VARCHAR(1000),
  subtitle_url VARCHAR(1000),
  dietary_tags VARCHAR(500),
  status ENUM('PUBLISHED','PENDING','REJECTED') DEFAULT 'PUBLISHED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ingredients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recipe_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  name_ta VARCHAR(150),
  quantity VARCHAR(50),
  unit VARCHAR(50),
  unit_ta VARCHAR(50),
  FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recipe_steps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recipe_id INT NOT NULL,
  step_no INT NOT NULL,
  instruction TEXT NOT NULL,
  instruction_ta TEXT,
  FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favorites (
  user_id INT NOT NULL, recipe_id INT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(user_id,recipe_id), FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS collections (
  id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, name VARCHAR(120) NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS collection_recipes (
  collection_id INT NOT NULL, recipe_id INT NOT NULL, PRIMARY KEY(collection_id,recipe_id),
  FOREIGN KEY(collection_id) REFERENCES collections(id) ON DELETE CASCADE,
  FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY, recipe_id INT NOT NULL, user_id INT NOT NULL,
  rating TINYINT NOT NULL CHECK(rating BETWEEN 1 AND 5), comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UNIQUE(recipe_id,user_id),
  FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS recently_accessed (
  user_id INT NOT NULL, recipe_id INT NOT NULL,
  accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(user_id,recipe_id), FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS shopping_items (
  id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, name VARCHAR(150) NOT NULL,
  quantity VARCHAR(50), unit VARCHAR(50), category VARCHAR(80) DEFAULT 'Other',
  purchased BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS meal_plans (
  id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, plan_date DATE NOT NULL,
  meal_type ENUM('Breakfast','Lunch','Dinner','Snack') NOT NULL, recipe_id INT NOT NULL,
  UNIQUE(user_id,plan_date,meal_type), FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- Upgrade an existing CookShare database once:
-- ALTER TABLE recipes ADD COLUMN title_ta VARCHAR(200), ADD COLUMN description_ta TEXT,
-- ADD COLUMN video_url VARCHAR(1000), ADD COLUMN subtitle_url VARCHAR(1000);
-- ALTER TABLE ingredients ADD COLUMN name_ta VARCHAR(150), ADD COLUMN unit_ta VARCHAR(50);
-- ALTER TABLE recipe_steps ADD COLUMN instruction_ta TEXT;
