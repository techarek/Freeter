const express = require("express");

const Freets = require("../models/Freets");
const Users = require("../models/Users");

// ------------------------------ AUTH

const ensureUserNotLoggedIn = function(req, res, next) {
    if (req.session.username) {
        res.status(400)
            .json({ error: "You are already signed in!" })
            .end();
        return;
    }

    next();
};

const ensureUserLoggedIn = function(req, res, next) {
    if (!req.session.username) {
        res.status(401)
            .json({ error: "You must be logged in to perform this action!" })
            .end();
        return;
    }

    next();
};

const ensureUserExists = function(req, res, next) {
    if (!Users.findUser(req.body.username)) {
        console.log(req.body.username);
        res.status(404)
            .json({
                error: "There is no account associated with this username!"
            })
            .end();
        return;
    }

    next();
};

const ensureUserDoesNotExists = function(req, res, next) {
    if (Users.findUser(req.body.username)) {
        res.status(400)
            .json({
                error: `The username ${req.body.username} has already been taken.`
            })
            .end();
        return;
    }

    next();
};

const ensureUserIsAuthenticated = function(req, res, next) {
    if (!Users._authenticateUser(req.body.username, req.body.password)) {
        res.status(400)
            .json({ error: "Your name or password is incorrect!" })
            .end();
        return;
    }

    next();
};

const ensureUserHasAccessToModifyFreet = function(req, res, next) {
    const freet = Freets.findFreetByID(req.params.id);
    if (freet.author !== req.session.username) {
        res.status(403)
            .json({
                error: `You do not have permissions to modify this freet associated with ID ${req.params.id}.`
            })
            .end();
        return;
    }

    next();
};

const ensureUserSessionIsActive = function(req, res, next) {
    if (!Users.findUser(req.session.username)) {
        res.status(401)
            .json({
                error: `Your session has expired. Please login again.`
            })
            .end();
        req.session.destroy();
        return;
    }

    next();
};

// ------------------------------ BODY

const ensureValidUsernameInBody = function(req, res, next) {
    if (!req.body.username.trim()) {
        res.status(400)
            .json({
                error: "Username must be non-empty!"
            })
            .end();
        return;
    }

    next();
};

const ensureValidPasswordInBody = function(req, res, next) {
    if (!req.body.password.trim()) {
        res.status(400)
            .json({
                error: "Password must be non-empty!"
            })
            .end();
        return;
    }

    next();
};

const ensureValidFreetContentInBody = function(req, res, next) {
    if (!req.body.content.trim()) {
        res.status(400)
            .json({
                error: "You must specify a non-empty Freet message!"
            })
            .end();
        return;
    }

    next();
};

const ensureValidFreetLengthInBody = function(req, res, next) {
    if (req.body.content.length > 140) {
        res.status(400)
            .json({
                error: "Your freet must be less than 140 characters long."
            })
            .end();
        return;
    }

    next();
};

// ------------------------------ PARAMS

const ensureValidFreetIDInParams = function(req, res, next) {
    if (!req.params.id) {
        res.status(400)
            .json({
                error: "You must specify a non-empty Freet ID!"
            })
            .end();
        return;
    }

    next();
};

const ensureValidUsernameInParams = function(req, res, next) {
    if (!req.params.username.trim()) {
        res.status(400)
            .json({
                error: "Username must be non-empty!"
            })
            .end();
        return;
    }

    next();
};

const ensureFreetExistsGivenIDParam = function(req, res, next) {
    if (!Freets.findFreetByID(req.params.id)) {
        res.status(404)
            .json({
                error: `The Freet associated with ID ${req.params.id} does not exist.`
            })
            .end();
        return;
    }

    next();
};

const ensureUserUnableToEditRefreet = function(req, res, next) {
    const freet = Freets.findFreetByID(req.params.id);
    if (freet.refreetOf) {
        res.status(403)
            .json({
                error: `You are unable to edit a refreet!`
            })
            .end();
        return;
    }

    next();
};

// ------------------------------ REFREETS
const ensureUserHasRefreeted = function(req, res, next) {
    const freet = Freets.findFreetByID(req.params.id);
    const usernamesRefreetThisFreet = freet.freetsRefreetingThisFreet.map(
        f => f.refreetUser.name
    );

    // User has not refreeted
    if (!usernamesRefreetThisFreet.includes(req.session.username)) {
        res.status(404)
            .json({
                error: `You have not refreeted this freet with ID ${req.params.id}!`
            })
            .end();
        return;
    }

    next();
};

const ensureUserHasNotRefreeted = function(req, res, next) {
    const freet = Freets.findFreetByID(req.params.id);
    const usernamesRefreetThisFreet = freet.freetsRefreetingThisFreet.map(
        f => f.refreetUser.name
    );

    // User has already refreeted
    if (usernamesRefreetThisFreet.includes(req.session.username)) {
        res.status(404)
            .json({
                error: `You have already refreeted this freet with ID ${req.params.id}!`
            })
            .end();
        return;
    }

    next();
};

const ensureUserCantDeleteRegularRefreets = function(req, res, next) {
    const freet = Freets.findFreetByID(req.params.id);

    if (freet.content === null) {
        res.status(404)
            .json({
                error: `You can't delete a regular refreet! Please un-refreet your freet if you wish to delete your refreet.`
            })
            .end();
        return;
    }

    next();
};

module.exports = {
    // User authentication/resource checks
    ensureUserNotLoggedIn,
    ensureUserLoggedIn,
    ensureUserExists,
    ensureUserDoesNotExists,
    ensureUserIsAuthenticated,
    ensureUserSessionIsActive,

    // User non-empty fields
    ensureValidUsernameInBody,
    ensureValidPasswordInBody,
    ensureValidUsernameInParams,

    // Freet authentication/resource checks
    ensureUserHasAccessToModifyFreet,
    ensureFreetExistsGivenIDParam,
    ensureUserUnableToEditRefreet,

    // Freet non-empty fields
    ensureValidFreetContentInBody,
    ensureValidFreetIDInParams,

    // Ensures freets < 140 characters
    ensureValidFreetLengthInBody,

    // Refreets
    ensureUserHasRefreeted,
    ensureUserHasNotRefreeted,
    ensureUserCantDeleteRegularRefreets
};
