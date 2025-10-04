CREATE
DATABASE usersdb;

CREATE TABLE users
(
    id                 SERIAL PRIMARY KEY,
    nickname           VARCHAR(50) NOT NULL,
    password           TEXT        NOT NULL,
    created_at         TIMESTAMP DEFAULT NOW(),
    refresh_token_hash VARCHAR(350)
);

CREATE TABLE genres
(
    id         SERIAL PRIMARY KEY,
    tmdb_id    INT UNIQUE  NOT NULL,
    name       TEXT UNIQUE NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE liked_genres_by_users
(
    user_id    INT NOT NULL,
    genre_id   INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, genre_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres (id) ON DELETE CASCADE
);

CREATE TABLE collections
(
    id      SERIAL PRIMARY KEY,
    tmdb_id INT UNIQUE  NOT NULL,
    name    TEXT UNIQUE NOT NULL,
    poster  VARCHAR(100) UNIQUE
);

CREATE TABLE liked_collections_by_users
(
    user_id       INT NOT NULL,
    collection_id INT NOT NULL,
    created_at    TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, collection_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (collection_id) REFERENCES collections (id) ON DELETE CASCADE
);

CREATE TABLE studios
(
    id      SERIAL PRIMARY KEY,
    tmdb_id INT UNIQUE  NOT NULL,
    name    TEXT UNIQUE NOT NULL,
    logo    VARCHAR(100) UNIQUE
);

CREATE TABLE liked_studios_by_users
(
    user_id    INT NOT NULL,
    studio_id  INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, studio_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (studio_id) REFERENCES studios (id) ON DELETE CASCADE
);

CREATE TABLE watch_providers
(
    id      SERIAL PRIMARY KEY,
    tmdb_id INT UNIQUE  NOT NULL,
    name    TEXT UNIQUE NOT NULL,
    logo_path    VARCHAR(100) UNIQUE
);

CREATE TABLE liked_watch_providers_by_users
(
    user_id           INT NOT NULL,
    watch_provider_id INT NOT NULL,
    created_at        TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, watch_provider_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (watch_provider_id) REFERENCES watch_providers (id) ON DELETE CASCADE
);

CREATE TABLE runtime_categories
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) UNIQUE NOT NULL,
    min_minutes INT                 NOT NULL,
    max_minutes INT
);

CREATE TABLE liked_runtime_categories_by_users
(
    user_id             INT NOT NULL,
    runtime_category_id INT NOT NULL,
    created_at          TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, runtime_category_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (runtime_category_id) REFERENCES runtime_categories (id) ON DELETE CASCADE
);

CREATE TABLE people
(
    id         SERIAL PRIMARY KEY,
    tmdb_id    INT UNIQUE          NOT NULL,
    name       VARCHAR(100) UNIQUE NOT NULL,
    profile_path    VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE liked_people_by_users
(
    user_id    INT NOT NULL,
    person_id    INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, person_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (person_id) REFERENCES people (id) ON DELETE CASCADE
);

CREATE TABLE movies
(
    id         SERIAL PRIMARY KEY,
    tmdb_id    INT UNIQUE   NOT NULL,
    title      VARCHAR(100) NOT NULL,
    poster     VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);