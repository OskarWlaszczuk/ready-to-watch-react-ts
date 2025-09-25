CREATE DATABASE usersdb;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,      
    nickname VARCHAR(50) NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    refresh_token_hash VARCHAR(350)
);

CREATE TABLE genres (
  id INT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE liked_genres_by_users (
  user_id INT NOT NULL,
  genre_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, genre_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

CREATE TABLE collections (
  id INT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE liked_collections_by_users (
  user_id INT NOT NULL,
  collection_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, collection_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE
);

CREATE TABLE runtime_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,       
  min_minutes INT NOT NULL,              
  max_minutes INT                          
);

CREATE TABLE liked_runtime_categories_by_users (
  user_id INT NOT NULL,
  runtime_category_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, runtime_category_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (runtime_category_id) REFERENCES runtime_categories(id) ON DELETE CASCADE
);