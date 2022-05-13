const express = require("express");

const Freets = require("../models/Freets");
const Users = require("../models/Users");

const v = require("./validators");

const router = express.Router();

/**
 * Create a Freet if the user is logged in
 * @name POST/api/freets
 * @param {string} content - content of the freet as a string where messages are 140 characters or less
 * @return {Freet} - the created Freet object
 */
router.post(
    "/",
    [
        v.ensureUserLoggedIn,
        v.ensureValidFreetContentInBody,
        v.ensureValidFreetLengthInBody
    ],
    (req, res) => {
        const freet = Freets.addFreet(req.body.content, req.session.username);
        const jsonFreet = Freets._convertToValidJSONFreets([freet]);

        res.status(200)
            .json(jsonFreet)
            .end();
    }
);

/**
 * Lists all Freets regardless of author
 * @name GET/api/freets
 * @return {Freet[]} - list of all Freets
 */
router.get("/", (req, res) => {
    const freets = Freets.findAllUsersFreets().reverse();
    const jsonFreets = Freets._convertToValidJSONFreets(
        freets,
        req.session.username !== undefined
    );

    res.status(200)
        .json(jsonFreets)
        .end();
});

/**
 * Lists all Freets associated with an author
 * @name GET/api/freets/:author
 * :author is a username (as a string)
 * @return {Freet[]} - list of all Freets associated with the given author
 */
router.get("/:author", (req, res) => {
    if (!Users.findUser(req.params.author)) {
        res.status(404).json({
            error: `Author with the name: ${req.params.author} does not exist!`
        });
        return;
    }

    const freets = Freets.findFreetsByAuthor(req.params.author).reverse();
    const jsonFreets = Freets._convertToValidJSONFreets(
        freets,
        req.session.username !== undefined
    );

    res.status(200)
        .json(jsonFreets)
        .end();
});

/**
 * Updates a Freet if the user is logged in and the Freet associated with the given id exists
 * @name PUT/api/freets/:id
 * :id is the unique ID of the Freet
 * @param {string} content - new content that the user wants to update
 * @return {Freet} - the updated Freet object
 */
router.put(
    "/:id",
    [
        v.ensureUserLoggedIn,
        v.ensureValidFreetIDInParams,
        v.ensureFreetExistsGivenIDParam,
        v.ensureUserHasAccessToModifyFreet,
        v.ensureValidFreetContentInBody,
        v.ensureValidFreetLengthInBody,
        v.ensureUserUnableToEditRefreet
    ],
    (req, res) => {
        const freet = Freets.editFreet(req.params.id, req.body.content);
        const jsonFreet = Freets._convertToValidJSONFreets([freet]);

        res.status(200)
            .json(jsonFreet[0])
            .end();
    }
);

/**
 * Deletes a Freet if the user is logged in and the Freet associated with the given id exists
 * @name DELETE/api/freets/:id
 * :id is the unique ID of the Freet
 * @return {Freet} - the deleted Freet object
 */
router.delete(
    "/:id",
    [
        v.ensureUserLoggedIn,
        v.ensureValidFreetIDInParams,
        v.ensureFreetExistsGivenIDParam,
        v.ensureUserHasAccessToModifyFreet,
        v.ensureUserCantDeleteRegularRefreets
    ],
    (req, res) => {
        const deletedFreet = Freets.deleteFreet(req.params.id);
        const jsonFreet = Freets._convertToValidJSONFreets([deletedFreet]);
        res.status(200)
            .json(jsonFreet[0])
            .end();
    }
);

/**
 * Likes a freet
 * @name PATCH/api/freets/:id/likes
 * @param {string} id - ID of freet to like (via req.params.id)
 */
router.patch(
    "/:id/likes",
    [
        v.ensureUserLoggedIn,
        v.ensureValidFreetIDInParams,
        v.ensureFreetExistsGivenIDParam
    ],
    (req, res) => {
        const freet = Users.likeFreet(req.params.id, req.session.username);

        res.status(200)
            .json({
                id: freet.id,
                content: freet.content,
                editHistory: freet.editHistory,
                author: freet.author,
                likes: freet.usersLikingFreet.length,
                usersLikingFreet: freet.usersLikingFreet.map(user => user.name)
            })
            .end();
    }
);

module.exports = router;
