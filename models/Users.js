const Freets = require("../models/Freets");

/**
 * @typedef User
 * @prop {string} name - some unique user name string
 * @prop {string} password - user password
 * @prop {Array[User]} followers - array of individuals that follows this user
 * @prop {Array[User]} following - array of individuals that this user is following
 */

/**
 * Returns a closured Users object that can execute user operations
 * Stores all users.
 * Wherever you import this class, you will be accessing the same data.
 */
function Users() {
    let _data = [];

    const that = Object.create(Users.prototype);

    /**
     * Add a user.
     * @param {string} name - user name
     * @param {string} password - user password
     * @return {string} - name of created user
     */
    that.addUser = (name, password) => {
        const followers = [];
        const following = [];
        const user = {
            name,
            password,
            followers,
            following
        };

        _data.push(user);
        return user.name;
    };

    /**
     * Find a user by their unique name.
     * @param {string} name - name of user to find
     * @return {User | undefined} - User object found or undefined
     */
    that.findUser = name => {
        return _data.filter(user => user.name === name)[0];
    };

    /**
     * Return an array of all Users
     * @return {User[]}
     */
    that.findAllUsers = () => {
        return [..._data];
    };

    /**
     * Update a user name.
     * @param {string} name - name of user to update
     * @param {string} newName - new name
     * @return {string | undefined} - name of updated user
     */
    that.updateName = (name, newName) => {
        // Update every freet under the old name to now be under the new name
        const freetsAssociatedWithOldName = Freets.findFreetsByAuthor(name);
        freetsAssociatedWithOldName.forEach(freet => {
            Freets._updateFreetAuthor(freet.id, newName);
        });

        const user = that.findUser(name);
        user.name = newName;

        return newName;
    };

    /**
     * Update a user password.
     * @param {string} name - name of user to update
     * @param {string} newPw - new password
     * @return {string | undefined} - name of updated user
     */
    that.updatePassword = (name, newPw) => {
        const user = that.findUser(name);
        user.password = newPw;
        return user.name;
    };

    /**
     * Delete a user
     * @param {string} name - name of user to delete
     * @return {User | undefined} - deleted User object
     */
    that.deleteUser = name => {
        const user = that.findUser(name);

        const likedFreets = Freets.findLikedFreetsByUsername(name);

        // Decrement the number of likes by 1 for every freet this user liked that was not their freet
        likedFreets.forEach(freet => {
            if (freet) {
                freet.usersLikingFreet = freet.usersLikingFreet.filter(
                    user => user.name !== name
                );
            }
        });

        const freetsAssociatedWithUser = Freets.findFreetsByAuthor(name);

        freetsAssociatedWithUser.forEach(freet => {
            Freets.deleteFreet(freet.id);
        });

        // Remove this user entry from all its follower's following list
        user.followers.forEach(followerUser => {
            followerUser.following = followerUser.following.filter(
                u => u.name != name
            );
        });

        // Remove this user entry from all its following's follower list
        user.following.forEach(followingUser => {
            followingUser.followers = followingUser.followers.filter(
                u => u.name != name
            );
        });

        _data = _data.filter(user => user.name !== name);
        return user;
    };

    /**
     * Upvotes a freet
     * @param {string} id - ID of Freet to like
     * @param {string} name - Username of user doing the liking
     * @return {Freet | undefined} - Freet object after liking occurs
     */
    that.likeFreet = (id, name) => {
        let originFreet = Freets.findFreetByID(id);
        const freet = originFreet.content
            ? originFreet
            : Freets.findFreetByID(originFreet.refreetOf);

        const user = that.findUser(name);

        const currentUsersLikingFreet = freet.usersLikingFreet;
        const currentUsernamesLikingfreet = currentUsersLikingFreet.map(
            user => user.name
        );

        if (!currentUsernamesLikingfreet.includes(user.name)) {
            currentUsersLikingFreet.push(user);
        } else {
            freet.usersLikingFreet = currentUsersLikingFreet.filter(
                user => user.name != name
            );
        }

        return freet;
    };

    /**
     * Follows another individual
     * @param {string} from - username of individual who is the follower
     * @param {string} to - username of individual the follower wants to follow
     * @return {User} - User object after following occurs
     */
    that.follow = (from, to) => {
        const followingUser = that.findUser(to);
        const followerUser = that.findUser(from);

        followerUser.following.push(followingUser);
        followingUser.followers.push(followerUser);

        return followerUser;
    };

    /**
     * un-Follows another individual
     * @param {string} from - username of individual who is the follower
     * @param {string} to - username of individual the follower wants to follow
     * @return {User} - User object after following occurs
     */
    that.unFollow = (from, to) => {
        const followingUser = that.findUser(to);
        const followerUser = that.findUser(from);

        const followingUserFollowers = followingUser.followers;
        const followerUserFollowing = followerUser.following;

        followingUser.followers = followingUserFollowers.filter(
            user => user.name != from
        );
        followerUser.following = followerUserFollowing.filter(
            user => user.name != to
        );

        return followerUser;
    };

    that.getFollowingUsersFreets = name => {
        const user = that.findUser(name);

        const allFollowingUsersFreets = user.following.reduce(
            (accum, followingUser) => {
                accum.push(...Freets.findFreetsByAuthor(followingUser.name));
                return accum;
            },
            []
        );

        allFollowingUsersFreets.sort((a, b) => (a.id < b.id ? 1 : -1));

        return allFollowingUsersFreets;
    };

    /**
     * Given a user's username, returns that user's list of followers
     * @param {string} name - username of user
     * @return {string[]} - List of usernames that follows this user
     */
    that.getFollowers = name => {
        const user = that.findUser(name);
        return [...user.followers];
    };

    /**
     * Given a user's username, returns a list of users that the user follows
     * @param {string} name - username of user
     * @return {string[]} - List of usernames that this user follows
     */
    that.getFollowing = name => {
        const user = that.findUser(name);
        return [...user.following];
    };

    /**
     * Refreets a freet where the user is able to quote another freet and add in their own freet message
     * @param {string} id - ID of Freet to refreet
     * @param {string} name - Username of user refreeting
     * @param {string} refreetContent - Additional text the user wants to add to the refreet
     * @return {Freet} - New refreet Freet object
     */
    that.refreetQuote = (id, name, refreetContent) => {
        const freet = Freets.findFreetByID(id);
        const refreetOf = freet.content ? id : freet.refreetOf;

        const newFreet = Freets.addFreet(refreetContent, name, refreetOf);
        newFreet.editHistory = freet.editHistory;

        // Current freet is not a regular refreet
        if (freet.content) {
            freet.freetsRefreetingThisFreet.push(newFreet);
        }
        // Current freet is a regular refreet
        else {
            const parentFreet = Freets.findFreetByID(refreetOf);
            parentFreet.freetsRefreetingThisFreet.push(newFreet);
        }

        return {
            ...newFreet,
            parentFreetOriginalContent: freet.content,
            parentFreetAuthor: freet.author,
            parentFreetLikes: freet.usersLikingFreet.length
        };
    };

    /**
     * Refreets a freet with no additional content
     * @param {string} id - ID of Freet to refreet
     * @param {string} name - Username of user refreeting
     * @return {Freet} - New refreet Freet object
     */
    that.refreet = (id, name) => {
        const freet = Freets.findFreetByID(id);
        const refreetOf = freet.content ? id : freet.refreetOf;

        const oldRefreet = Freets.findFreetsByAuthor(name).filter(
            freet => freet.refreetOf === refreetOf
        );

        if (oldRefreet.length !== 0 && !oldRefreet[0].content) {
            // Current freet is not a regular refreet
            if (freet.content) {
                freet.freetsRefreetingThisFreet = freet.freetsRefreetingThisFreet.filter(
                    f => f.id != oldRefreet[0].id
                );
            }
            // Current freet is a regular refreet
            else {
                const parentFreet = Freets.findFreetByID(refreetOf);
                parentFreet.freetsRefreetingThisFreet = parentFreet.freetsRefreetingThisFreet.filter(
                    f => f.id != oldRefreet[0].id
                );
            }

            return Freets.deleteFreet(oldRefreet[0].id);
        }

        const newFreet = Freets.addFreet(null, name, refreetOf);
        newFreet.editHistory = freet.editHistory;

        if (freet.content) {
            freet.freetsRefreetingThisFreet.push(newFreet);
        } else {
            const parentFreet = Freets.findFreetByID(refreetOf);
            parentFreet.freetsRefreetingThisFreet.push(newFreet);
        }

        return {
            ...newFreet,
            parentFreetOriginalContent: freet.content,
            parentFreetAuthor: freet.author,
            parentFreetLikes: freet.usersLikingFreet.length
        };
    };

    /**
     * Authenticate a user
     * @param {string} name - name of user to authenticate
     * @param {string} password - password of user to authenticate
     * @return {true | false} - whether the user's credentials are correct
     */
    that._authenticateUser = (name, password) => {
        const user = that.findUser(name);
        if (!user) {
            return false;
        }

        return user.password === password;
    };

    Object.freeze(that);
    return that;
}

module.exports = Users();
