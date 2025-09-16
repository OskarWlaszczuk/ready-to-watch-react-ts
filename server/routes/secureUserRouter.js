require("dotenv").config();
const express = require("express");
const secureUserRouter = express.Router();
const jwt = require("jsonwebtoken");
const { getUserNickname, getUserAccontDate } = require("../controllers/secureUser");
const util = require("util");
const pool = require("../db");
const verifyJwt = util.promisify(jwt.verify);

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
    console.log(`Adding preffered genre...`);

    const {  genreId } = request.body;
    const { tokenPayload } = request;

    try {
        await pool.query(
            // ON CONFLICT DO NOTHING, jak działa
            "INSERT INTO preferred_genres_by_user (user_id, tmdb_genre_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [tokenPayload.id, genreId]
        );
        response.status(201).json({ genreId });
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: "Database error" });
    }
};

const getLikedGenres = async (request, response) => {
    const { tokenPayload } = request;

    try {
        const result = await pool.query(
            "SELECT tmdb_genre_id FROM preferred_genres_by_user WHERE user_id = $1",
            [tokenPayload.id]
        );
        const tmdbGenresIds = result.rows.map(({ tmdb_genre_id }) => tmdb_genre_id);
        console.log(tmdbGenresIds);

        response.json({
            success: true,
            data: tmdbGenresIds,
        });
    } catch (err) {
        console.error(err);
        response.status(500).json({
            success: false,
            message: 'error',
        });
    }
};

const dislikeGenre = async (request, response) => {
    console.log(`Disliking genre...`);
    
    const { tokenPayload } = request;
    const { genreId } = request.params;

    try {
        await pool.query(
            "DELETE FROM preferred_genres_by_user WHERE tmdb_genre_id = $1 AND user_id = $2",
            [genreId, tokenPayload.id]
        );

        response
            .status(200)
            .json({
                success: true,
                genreId,
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
secureUserRouter.route("/prefferences/genres").post(authenticateToken, isUserExists, likeGenre);
secureUserRouter.route("/prefferences/genres").get(authenticateToken, isUserExists, getLikedGenres);
secureUserRouter.route("/prefferences/genres/:genreId").delete(authenticateToken, isUserExists, dislikeGenre);

module.exports = secureUserRouter;