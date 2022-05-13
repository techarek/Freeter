const express = require("express");

const Users = require("../models/Users");
const v = require("./validators");

const router = express.Router();

/**
 * If the user is able to be authenticated, creates an authentication session for the user after authentication.
 *
 * @name POST /api/session
 */
router.post(
    "/",
    [
        v.ensureUserNotLoggedIn,
        v.ensureValidUsernameInBody,
        v.ensureValidPasswordInBody,
        v.ensureUserExists,
        v.ensureUserIsAuthenticated
    ],
    (req, res) => {
        req.session.username = req.body.username;
        res.status(200)
            .json({ message: `Welcome, ${req.session.username}!`, 
                    username: req.session.username})
            .end();
    }
);

/**
 * Sign the user out by destroying their authentication session.
 *
 * @name DELETE /api/session
 */
router.delete("/", [v.ensureUserLoggedIn], (req, res) => {
    req.session.destroy();
    res.status(200)
        .json({
            message: "Successfully signed out."
        })
        .end();
});

/**
 * Get the username of the current session
 *
 * @name GET /api/session
 */
router.get("/", [v.ensureUserLoggedIn], (req, res) => {
    const username = req.session.username;
    res.status(200).send(username);
});

module.exports = router;
