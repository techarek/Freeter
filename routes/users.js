const express = require("express");
const Users = require("../models/Users");
const Freets = require("../models/Freets");

const v = require("./validators");

const router = express.Router();

/**
 * Create a user.
 * @name POST/api/users
 * @param {string} name - name of user
 * @param {string} password - password of user
 * @return {User} - the created user
 * @throws {400} - if name is already taken
 */
router.post(
    "/",
    [
        v.ensureUserNotLoggedIn,
        v.ensureValidUsernameInBody,
        v.ensureValidPasswordInBody,
        v.ensureUserDoesNotExists
    ],
    (req, res) => {
        const user = Users.addUser(req.body.username, req.body.password);
        req.session.username = req.body.username;
        res.status(200)
            .json({ message: `User ${user} has been created`,
                    username: req.session.username})
            .end();
    }
);

/**
 * Update user's name
 * @name PUT/api/users/:username/username
 * @param {string} username - new name of user
 * @return {User} - the new username
 * @throws {400} - if name is already taken
 * @throws {401} - if attempting to update username while not logged in
 */
router.put(
    "/:username/username",
    [
        v.ensureValidUsernameInBody,
        v.ensureUserSessionIsActive,
        v.ensureUserLoggedIn
    ],
    (req, res) => {
        if (Users.findUser(req.body.username)) {
            if (req.session.username === req.body.username) {
                res.status(400)
                    .json({
                        error: "This your current username!"
                    })
                    .end();
            } else {
                res.status(400)
                    .json({
                        error: "This username is already taken!"
                    })
                    .end();
            }
        } else {
            const user = Users.updateName(
                req.session.username,
                req.body.username
            );

            req.session.username = user;
            res.status(200)
                .json({ message: `Your new user name is: ${user}` })
                .end();
        }
    }
);

/**
 * Update user's password
 * @name PUT/api/users/:username/password
 * @param {string} password - new name of user
 * @throws {401} - if attempting to update password while not logged in
 */
router.put(
    "/:username/password",
    [
        v.ensureValidPasswordInBody,
        v.ensureUserSessionIsActive,
        v.ensureUserLoggedIn
    ],
    (req, res) => {
        if (Users._authenticateUser(req.session.username, req.body.password)) {
            res.status(400)
                .json({
                    error:
                        "This is your current password! Please choose a different password!"
                })
                .end();
            return;
        }

        Users.updatePassword(req.session.username, req.body.password);
        res.status(200)
            .json({ message: "Your password has been changed." })
            .end();
    }
);

/**
 * Delete a user.
 * @name POST/api/users/:username/delete
 * @param {string} name - name of user
 * @param {string} password - password of user
 * @return {User} - the created user
 * @throws {400} - if name is already taken
 */
router.delete(
    "/:username",
    [v.ensureUserSessionIsActive, v.ensureUserLoggedIn],
    (req, res) => {
        if (Users.findUser(req.session.username)) {
            Users.deleteUser(req.session.username);
            req.session.destroy();
        }

        res.status(200)
            .json({
                message: `Successfully deleted account. You have been signed out. Please make a new account to post Freets.`
            })
            .end();
    }
);

/**
 * Follows another user
 * @name PATCH/api/users/:username/following
 * @param {string} username - username of the user we wish to follow (via req.params.username)
 */
router.patch(
    "/:username/following",
    [v.ensureUserLoggedIn, v.ensureValidUsernameInParams],
    (req, res) => {
        if (req.session.username === req.params.username) {
            res.status(400)
                .json({
                    error: "You can't follow yourself!"
                })
                .end();
            return;
        }

        const followingUser = Users.findUser(req.params.username);
        if (!followingUser) {
            res.status(404)
                .json({
                    error: `There is no user associated with this username: ${req.params.username}`
                })
                .end();
            return;
        }

        const followerUser = Users.findUser(req.session.username);
        const followingUsersNames = followerUser.following.map(
            user => user.name
        );

        if (followingUsersNames.includes(req.params.username)) {
            const user = Users.unFollow(
                req.session.username,
                req.params.username
            );

            res.status(200)
                .json({
                    message: `You are now un-following ${req.params.username}!`,
                    name: user.name,
                    following: user.following.map(user => user.name)
                })
                .end();
            return;
        }

        const user = Users.follow(req.session.username, req.params.username);
        res.status(200)
            .json({
                message: `You are now following ${req.params.username}!`,
                name: user.name,
                following: user.following.map(user => user.name)
            })
            .end();
    }
);

router.get(
    "/:username/following/freets",
    [v.ensureUserLoggedIn],
    (req, res) => {
        const followingUsersFreets = Users.getFollowingUsersFreets(
            req.session.username
        );
        const jsonFreets = Freets._convertToValidJSONFreets(
            followingUsersFreets
        );

        res.status(200)
            .json(jsonFreets)
            .end();
    }
);

router.get("/:username/followers", [v.ensureUserLoggedIn], (req, res) => {
    const followers = Users.getFollowers(req.session.username);

    res.status(200)
        .json({
            followers: followers.map(user => user.name)
        })
        .end();
});

router.get("/:username/following", [v.ensureUserLoggedIn], (req, res) => {
    const following = Users.getFollowing(req.session.username);

    res.status(200)
        .json({
            following: following.map(user => user.name)
        })
        .end();
});

router.post(
    "/freets/:id/refreet-quote",
    [
        v.ensureUserLoggedIn,
        v.ensureValidFreetIDInParams,
        v.ensureFreetExistsGivenIDParam,
        v.ensureValidFreetContentInBody,
        v.ensureValidFreetLengthInBody
    ],
    (req, res) => {
        const freet = Users.refreetQuote(
            req.params.id,
            req.session.username,
            req.body.content
        );

        const jsonFreets = Freets._convertToValidJSONFreets([freet]);

        res.status(200)
            .json(jsonFreets[0])
            .end();
    }
);

router.post(
    "/freets/:id/refreet",
    [
        v.ensureUserLoggedIn,
        v.ensureValidFreetIDInParams,
        v.ensureFreetExistsGivenIDParam
    ],
    (req, res) => {
        const freet = Users.refreet(req.params.id, req.session.username);

        const jsonFreets = Freets._convertToValidJSONFreets([freet]);

        res.status(200)
            .json(jsonFreets[0])
            .end();
    }
);

module.exports = router;
