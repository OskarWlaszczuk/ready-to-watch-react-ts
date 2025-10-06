const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { getUserNickname, getUserAccontDate } = require("../controllers/secureUser");
const util = require("util");
const pool = require("../db");
const verifyJwt = util.promisify(jwt.verify);

const secureUserRouter = express.Router();

const authenticateToken = async (request, response, next) => {
    const authHeader = request.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];

    if (!accessToken) {
        console.log("token doesn't exist");
        return response
            .status(401)
            .json({
                success: false, message: "Unathorized"
            });
    }

    try {
        const tokenPayload = await verifyJwt(accessToken, process.env.ACCESS_TOKEN_SECRET);
        request.tokenPayload = tokenPayload;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return { valid: false, status: 403, code: "JWT_EXPIRED", message: "Access token expired, refresh it" };
        }
    }
};

const isUserExists = async (request, response, next) => {
    console.log('Checking is user exists...');
    const { tokenPayload } = request;

    const result = await pool.query("SELECT * FROM users WHERE id = $1", [tokenPayload.id]);

    if (result.rows.length === 0) {
        return response
            .status(400)
            .json({ success: false, message: "User doesn't exist" });
    }
    console.log(`User exists`);
    next();
};

const addLike = async ({
    userId,
    tmdbEntityId,
    entityName,
    entityTable,
    joinTable,
    joinColumn
}) => {
    //sprawdzenie, czy polubiona encja znajduje się już w tabeli encji
    const { rows: entities } = await pool.query(
        `SELECT *
         FROM ${entityTable}
         WHERE tmdb_id = $1`,
        [tmdbEntityId]
    );

    //jeśli nie to dodajemy polubioną encję do tabeli encji
    if (!entities.length) {
        const addNewEntityRow = `
            INSERT INTO ${entityTable} (tmdb_id, name)
            VALUES ($1, $2) ON CONFLICT DO NOTHING
        `;
        await pool.query(
            addNewEntityRow,
            [tmdbEntityId, entityName]
        );
    }
    const { rows } = await pool.query(
        `SELECT *
         FROM ${entityTable}
         WHERE tmdb_id = $1`,
        [tmdbEntityId]
    );
    console.log(rows);

    //stworzenie relacji user - encja
    await pool.query(
        `INSERT INTO ${joinTable} (user_id, ${joinColumn})
        VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [userId, rows[0].id]
    );
};

const getLikedEntities = async ({
    userId, entityTable, likedTable, entityIdColumn,
}) => {
    const query = `
        SELECT ${entityTable}.tmdb_id, ${entityTable}.name
        FROM ${likedTable} 
        JOIN ${entityTable}  ON ${likedTable}.${entityIdColumn} = ${entityTable}.id
        WHERE ${likedTable}.user_id = $1
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
};

const removeUserLike = async ({
    userId, tmdbEntityId, likedTable, entityIdColumn, entityTable
}) => {
    const { rows: entities } = await pool.query(
        `SELECT id FROM ${entityTable}
        WHERE tmdb_id = $1`,
        [tmdbEntityId]
    );

    const likedEntityId = entities[0].id;

    const dislikeQuery = `
        DELETE
        FROM ${likedTable}
        WHERE ${entityIdColumn} = $1
        AND user_id = $2
    `;

    await pool.query(dislikeQuery, [likedEntityId, userId]);
};


const likeGenre = async (request, response) => {
    const { id: genreTmdbId, name: genreName } = request.body;
    const userId = request.tokenPayload.id;
    console.log(`Adding liked genre: ${[genreTmdbId, genreName]}...`);

    try {
        await addLike({
            userId,
            tmdbEntityId: genreTmdbId,
            entityName: genreName,
            entityTable: "genres",
            joinTable: "liked_genres_by_users",
            joinColumn: "genre_id"
        });

        response.status(201).json({
            success: true,
            data: {
                tmdb_id: genreTmdbId,
                name: genreName
            }
        });
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: "Database error" });
    }
};

const getLikedGenres = async (request, response) => {
    try {
        const userId = request.tokenPayload.id;

        const likedGenres = await getLikedEntities({
            userId,
            entityTable: "genres",
            likedTable: "liked_genres_by_users",
            entityIdColumn: "genre_id"
        });

        return response.json({
            success: true,
            data: likedGenres
        });

    } catch (error) {
        console.error("Error fetching liked genres:", error);
        return response.status(500).json({
            success: false, message: "Internal server error"
        });
    }
};

const dislikeGenre = async (request, response) => {
    const userId = request.tokenPayload.id;
    const { tmdb_id: tmdbGenreId } = request.params;
    console.log(`Disliking genre ${tmdbGenreId}...`);
    console.log(tmdbGenreId);

    try {
        await removeUserLike({
            userId,
            tmdbEntityId: tmdbGenreId,
            likedTable: "liked_genres_by_users",
            entityIdColumn: "genre_id",
            entityTable: "genres",
        });

        response
            .status(200)
            .json({
                success: true,
                data: {
                    tmdb_id: tmdbGenreId
                }
            });
    } catch (err) {
        console.error(err);
        response.status(500).json({
            success: false, message: 'error',
        });
    }
};


const likeCollection = async (request, response) => {
    const { id: collectionTmdbId, name: collectionName } = request.body;
    const userId = request.tokenPayload.id;
    console.log(`Adding liked collection: ${[collectionTmdbId, collectionName]}...`);

    try {

        await addLike({
            userId,
            tmdbEntityId: collectionTmdbId,
            entityName: collectionName,
            entityTable: "collections",
            joinTable: "liked_collections_by_users",
            joinColumn: "collection_id"
        });

        response.status(201).json({
            success: true,
            data: {
                tmdb_id: collectionTmdbId,
                name: collectionName,
            },
        });
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: "Database error" });
    }
};

const getLikedCollections = async (request, response) => {
    try {
        console.log("getting liked collecetions...");
        const userId = request.tokenPayload.id;
        const likedCollections = await getLikedEntities({
            userId,
            entityTable: "collections",
            likedTable: "liked_collections_by_users",
            entityIdColumn: "collection_id"
        });

        console.log(" liked collecetions:", likedCollections);

        return response.json({
            success: true,
            data: likedCollections
        });

    } catch (error) {
        console.error("Error fetching liked genres:", error);
        return response.status(500).json({
            success: false, message: "Internal server error"
        });
    }
};

const dislikeCollection = async (request, response) => {
    const userId = request.tokenPayload.id;
    const { tmdb_id: collectionTmdbId } = request.params;
    console.log(`Disliking collection ${collectionTmdbId}...`);

    try {
        await removeUserLike({
            userId,
            tmdbEntityId: collectionTmdbId,
            likedTable: "liked_collections_by_users",
            entityIdColumn: "collection_id",
            entityTable: "collections",

        });

        response
            .status(200)
            .json({
                success: true,
                data: {
                    tmdb_id: collectionTmdbId
                },
            });

    } catch (err) {
        console.error(err);
        response.status(500).json({
            success: false, message: 'error',
        });
    }
};

const likePerson = async (request, response) => {
    const { id: personTmdbId, name: personName } = request.body;
    const userId = request.tokenPayload.id;
    console.log(`Adding liked person: ${[personTmdbId, personName]}...`);

    try {

        await addLike({
            userId,
            tmdbEntityId: personTmdbId,
            entityName: personName,
            entityTable: "people",
            joinTable: "liked_people_by_users",
            joinColumn: "person_id"
        });

        response.status(201).json({
            success: true,
            data: {
                tmdb_id: personTmdbId,
                name: personName,
            },
        });
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: "Database error" });
    }
};

const getLikedPeople = async (request, response) => {
    try {
        console.log("getting liked people...");
        const userId = request.tokenPayload.id;

        const likedPeople = await getLikedEntities({
            userId,
            entityTable: "people",
            likedTable: "liked_people_by_users",
            entityIdColumn: "person_id"
        });

        console.log(" liked people:", likedPeople);

        return response.json({
            success: true,
            data: likedPeople
        });

    } catch (error) {
        console.log("Error fetching liked people:", error);
        return response.status(500).json({
            success: false, message: "Internal server error"
        });
    }
};

const dislikePerson = async (request, response) => {
    const userId = request.tokenPayload.id;
    const { tmdb_id: personTmdbId } = request.params;
    console.log(`Disliking person ${personTmdbId}...`);

    try {
        await removeUserLike({
            userId,
            tmdbEntityId: personTmdbId,
            likedTable: "liked_people_by_users",
            entityIdColumn: "person_id",
            entityTable: "people",
        });

        response
            .status(200)
            .json({
                success: true,
                data: {
                    tmdb_id: personTmdbId
                },
            });

    } catch (err) {
        console.error(err);
        response.status(500).json({
            success: false,
            message: 'error',
        });
    }
};

const likeRuntimeCategory = async (request, response) => {
    const { id: runtimeCategoryId } = request.body;
    const userId = request.tokenPayload.id;
    console.log(`Adding liked runtimeCategory: ${[runtimeCategoryId]}...`);

    const insertQuery = `INSERT INTO liked_runtime_categories_by_users 
    (user_id, runtime_category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`;

    try {
        await pool.query(
            insertQuery,
            [userId, runtimeCategoryId]
        );

        response.status(201).json({
            success: true,
            data: {
                id: runtimeCategoryId,
            }
        });
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: "Database error" });
    }
};

const getRuntimeCategories = async (request, response) => {
    try {
        const selectQuery = `SELECT * FROM runtime_categories`;
        const { rows: runtimeCategories } = await pool.query(selectQuery);

        response
            .status(200)
            .json({
                success: true,
                data: runtimeCategories,
            });

    } catch (error) {
        console.log(`Error in getRuntimeCategories`, error);
        return response.status(500).json({
            success: false, message: "Internal server error"
        });
    }
};

const getLikedRuntimeCategories = async (request, response) => {
    try {
        const userId = request.tokenPayload.id;

        const query = `
        SELECT runtime_categories.id, runtime_categories.name
        FROM liked_runtime_categories_by_users
        JOIN runtime_categories  ON liked_runtime_categories_by_users.runtime_category_id = runtime_categories.id
        WHERE liked_runtime_categories_by_users.user_id = $1
    `;

        const { rows: likedRuntimeCategories } = await pool.query(query, [userId]);

        return response.json({
            success: true,
            data: likedRuntimeCategories
        });

    } catch (error) {
        console.error("Error fetching liked runtime categories:", error);
        return response.status(500).json({
            success: false, message: "Internal server error"
        });
    }
};

const dislikeRuntimeCategory = async (request, response) => {
    const userId = request.tokenPayload.id;
    const { id: runtimeCategoryId } = request.params;
    console.log(`Disliking runtime category ${runtimeCategoryId}...`);

    try {
        const deleteQuery = `
        DELETE
        FROM liked_runtime_categories_by_users
        WHERE runtime_category_id= $1
        AND user_id = $2
    `;
        await pool.query(deleteQuery, [userId, runtimeCategoryId]);

        response
            .status(200)
            .json({
                success: true,
                data: {
                    id: runtimeCategoryId
                }
            });
    } catch (err) {
        console.error(err);
        response.status(500).json({
            success: false, message: 'error',
        });
    }
};

secureUserRouter.route("/nickname")
    .get(authenticateToken, isUserExists, getUserNickname);
secureUserRouter.route("/accountDate")
    .get(authenticateToken, isUserExists, getUserAccontDate);

secureUserRouter.route("/runtimeCategories")
    .get(getRuntimeCategories);

secureUserRouter.route("/liked/genres")
    .post(authenticateToken, isUserExists, likeGenre)
    .get(authenticateToken, isUserExists, getLikedGenres);
secureUserRouter.route("/liked/genres/:tmdb_id")
    .delete(authenticateToken, isUserExists, dislikeGenre);

secureUserRouter.route("/liked/collections")
    .post(authenticateToken, isUserExists, likeCollection)
    .get(authenticateToken, isUserExists, getLikedCollections);
secureUserRouter.route("/liked/collections/:tmdb_id")
    .delete(authenticateToken, isUserExists, dislikeCollection);

secureUserRouter.route("/liked/people")
    .post(authenticateToken, isUserExists, likePerson)
    .get(authenticateToken, isUserExists, getLikedPeople);
secureUserRouter.route("/liked/people/:tmdb_id")
    .delete(authenticateToken, isUserExists, dislikePerson);

secureUserRouter.route("/liked/runtimeCategories")
    .post(authenticateToken, isUserExists, likeRuntimeCategory)
    .get(authenticateToken, isUserExists, getLikedRuntimeCategories);
secureUserRouter.route("/liked/runtimeCategories/:id")
    .delete(authenticateToken, isUserExists, dislikeRuntimeCategory);



module.exports = secureUserRouter;



// const fetchTMDB = async (endpointPath) => {
//     const endpoint = `https://api.themoviedb.org/3/${endpointPath}`;
//     const auth = {
//         headers: {
//             Authorization: `Bearer ${process.env.TMDB_API_KEY}`
//         }
//     };

//     const result = await axios.get(endpoint, auth);
//     return result.data;
// };

// const getMovieGenres = async (request, response) => {
//     try {
//         console.log(`getting movie genres...`);

//         const { rows: genres } = await pool.query("SELECT * FROM genres");
//         console.log(genres)
//         const isEmpty = genres.length === 0;
//         const REFRESH_INTERVAL_DAYS = 30;

//         if (isEmpty) {
//             const tmdbResponse = await fetchTMDB("genre/movie/list");
//             const tmdbMovieGenres = tmdbResponse.data.genres;

//             await Promise.all(tmdbMovieGenres.map(genre =>
//                 pool.query(
//                     `UPDATE genres
//                      SET name       = $1,
//                          updated_at = NOW()
//                      WHERE tmdb_id = $2`,
//                     [genre.name, genre.id]
//                 )
//             ));
//         }

//         const { rows: update_dates } = await pool.query(`
//             SELECT updated_at
//             FROM genres`
//         );

//         const lastUpdate = update_dates[0].updated_at;
//         const diffMs = Date.now() - new Date(lastUpdate).getTime();
//         const diffDays = diffMs / (1000 * 60 * 60 * 24);

//         const isOutdated = diffDays > REFRESH_INTERVAL_DAYS;

//         if (isOutdated) {
//             const tmdbResponse = await fetchTMDB("genre/movie/list");
//             const tmdbMovieGenres = tmdbResponse.data.genres;

//             await Promise.all(tmdbMovieGenres.map(genre =>
//                 pool.query(
//                     `UPDATE genres
//                      SET name       = $1,
//                          updated_at = NOW()
//                      WHERE tmdb_id = $2`,
//                     [genre.name, genre.id]
//                 )
//             ));
//         }

//         return response.status(200).json(genres);
//     } catch (err) {
//         console.error(err);
//         response.status(500).json({ error: "Failed to fetch genres" });
//     }
// };