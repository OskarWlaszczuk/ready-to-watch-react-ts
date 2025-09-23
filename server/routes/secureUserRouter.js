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
                success: false,
                message: "Unathorized"
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

    const result = await pool.query(
        "SELECT * FROM users WHERE id = $1",
        [tokenPayload.id]
    );

    if (result.rows.length === 0) {
        return response
            .status(400)
            .json({ success: false, message: "User doesn't exist" });
    }
    console.log(`User exists`);
    next();
};

const likeGenre = async (request, response) => {
    const { id: genreId, name: genreName } = request.body;
    const userId = request.tokenPayload.id;
    console.log(`Adding liked genre: ${[genreId, genreName]}...`);

    try {
        const result = await pool.query(
            "SELECT * FROM genres WHERE id = $1",
            [genreId]
        );

        const isGenreAvailable = result.rows.length > 0;

        if (!isGenreAvailable) {
            await pool.query(
                // ON CONFLICT DO NOTHING, jak działa
                "INSERT INTO genres (id, name) VALUES ($1, $2) ON CONFLICT DO NOTHING",
                [genreId, genreName]
            );
        }

        await pool.query(
            // ON CONFLICT DO NOTHING, jak działa
            "INSERT INTO liked_genres_by_users (user_id, genre_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [userId, genreId]
        );

        response.status(201).json({
            success: true,
            data: {
                id: genreId
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

        const query = `
            SELECT g.id, g.name
            FROM liked_genres_by_users l
            JOIN genres g ON l.genre_id = g.id
            WHERE l.user_id = $1;
        `;

        const result = await pool.query(query, [userId]);
        console.log(result.rows);

        return response.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error("Error fetching liked genres:", error);
        return response.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const dislikeGenre = async (request, response) => {
    const userId = request.tokenPayload.id;
    const { id: genreId } = request.params;
    console.log(`Disliking genre ${genreId}...`);

    try {
        await pool.query(
            "DELETE FROM liked_genres_by_users WHERE genre_id = $1 AND user_id = $2",
            [genreId, userId]
        );

        response
            .status(200)
            .json({
                success: true,
                data: {
                    id: genreId
                }
            });
    } catch (err) {
        console.error(err);
        response.status(500).json({
            success: false,
            message: 'error',
        });
    }
};

const likeCollection = async (request, response) => {
    const { id: collectionId, name: collectionName } = request.body;
    const userId = request.tokenPayload.id;
    console.log(`Adding liked collection: ${[collectionId, collectionName]}...`);

    try {
        const result = await pool.query(
            "SELECT * FROM collections WHERE id = $1",
            [collectionId]
        );

        const isCollectionStored = result.rows.length > 0;

        if (!isCollectionStored) {
            // ON CONFLICT DO NOTHING, jak działa
            const addNewCollectionQuery = "INSERT INTO collections (id, name) VALUES ($1, $2) ON CONFLICT DO NOTHING";
            await pool.query(
                addNewCollectionQuery,
                [collectionId, collectionName]
            );
        }

        // ON CONFLICT DO NOTHING, jak działa
        const addLikedCollectionQuery = "INSERT INTO liked_collections_by_users (user_id, collection_id) VALUES ($1, $2) ON CONFLICT DO NOTHING";
        await pool.query(
            addLikedCollectionQuery,
            [userId, collectionId]
        );

        response.status(201).json({
            success: true,
            data: {
                id: collectionId,
                name: collectionName,
            }
        });
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: "Database error" });
    }
};

const getLikedCollections = async (request, response) => {
    try {
        const userId = request.tokenPayload.id;

        const joinQuery = `
            SELECT c.id, c.name
            FROM liked_collections_by_users l
            JOIN collections c ON l.collection_id = c.id
            WHERE l.user_id = $1;
        `;

        const result = await pool.query(joinQuery, [userId]);
        console.log("getting liked collecetions", result.rows);

        return response.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error("Error fetching liked genres:", error);
        return response.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const dislikeCollection = async (request, response) => {
    const userId = request.tokenPayload.id;
    const { id: collectionId } = request.params;
    console.log(`Disliking collection ${collectionId}...`);

    try {
        const deleteLikedCollectionQuery = "DELETE FROM liked_collections_by_users WHERE collection_id = $1 AND user_id = $2";

        await pool.query(
            deleteLikedCollectionQuery,
            [collectionId, userId]
        );

        response
            .status(200)
            .json({
                success: true,
                data: {
                    id: collectionId
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

secureUserRouter.route("/nickname").get(authenticateToken, isUserExists, getUserNickname);
secureUserRouter.route("/accountDate").get(authenticateToken, isUserExists, getUserAccontDate);
secureUserRouter.route("/liked/genres")
    .post(authenticateToken, isUserExists, likeGenre)
    .get(authenticateToken, isUserExists, getLikedGenres);
secureUserRouter.route("/liked/genres/:id").delete(authenticateToken, isUserExists, dislikeGenre);
secureUserRouter.route("/liked/collections")
    .post(authenticateToken, isUserExists, likeCollection)
    .get(authenticateToken, isUserExists, getLikedCollections);
secureUserRouter.route("/liked/collections/:id").delete(authenticateToken, isUserExists, dislikeCollection);

module.exports = secureUserRouter;