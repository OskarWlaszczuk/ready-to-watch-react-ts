CREATE DATABASE usersdb;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,      
    nickname VARCHAR(50) NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    refresh_token_hash VARCHAR(350)
);

CREATE TABLE preferred_genres_by_user (
    user_id INT NOT NULL,
    tmdb_genre_id INT NOT NULL,
    PRIMARY KEY (user_id, tmdb_genre_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);