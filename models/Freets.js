/**
 * @typedef Freet
 * @prop {int} id - unique ID identifying one specific freet
 * @prop {string} content - content of the freet as a string where messages are 140 characters or less
 * @prop {string} author - username
 * @prop {Array[string]} editHistory - An array of strings that serves as the edit history for a non-refreeted freet
 * @prop {Array[Users]} usersLikingFreet - An array of users that liked a specific freet
 * @prop {Array[Freet]} freetsRefreetingThisFreet - an array of freets that have refreeted this freet
 * @prop {Freet} refreetOf - if this freet is a refreet, this field returns the parent of this refreet, else null
 */

/**
 * Returns a closured Freets object that can execute Freet operations
 * Wherever you import this class, you will be accessing the same data.
 */
function Freets() {
    let _data = [];
    let _counter = 0;

    const that = Object.create(Freets.prototype);

    /**
     * Add a Freet
     * @param {string} content - Freet content
     * @param {string} author - Freet user
     * @return {Freet} - returns a created Freet
     */
    that.addFreet = (
        content,
        author,
        refreetOf = null // Shows the ID of the parent freet
    ) => {
        const id = _counter.toString();

        const freet = {
            id,
            content,
            author,
            editHistory: [],
            usersLikingFreet: [],
            freetsRefreetingThisFreet: [],
            refreetOf
        };

        _counter++;
        _data.push(freet);
        return freet;
    };

    /**
     * Find a Freet by its unqiue ID
     * @param {int} id - ID of the Freet to find
     * @return {Freet | undefined} - Freet object found or undefined
     */
    that.findFreetByID = id => {
        return _data.filter(freet => freet.id === id)[0];
    };

    /**
     * Find all the Freets that are associated with an username (either directly an author of, or a refreetAuthor of)
     * @param {string} author - Author of Freets to find
     * @return {Freet[] | undefined} - A list of Freet objects found or undefined
     */
    that.findFreetsByAuthor = author => {
        return _data.filter(freet => freet.author === author);
    };

    that.findLikedFreetsByUsername = username => {
        return _data.filter(freet =>
            freet.usersLikingFreet.some(user => user.name === username)
        );
    };

    /**
     * Return an array of all Freets
     * @return {Freet[]}
     */
    that.findAllUsersFreets = () => {
        return [..._data];
    };

    /**
     * Edits a Freet's content given an ID.
     * @param {string} ID - ID of Freet to edit
     * @param {string} content - new content to edit
     * @return {Freet | undefined} - updated Freet object
     */
    that.editFreet = (id, content) => {
        const freet = that.findFreetByID(id);

        if (freet.content) {
            freet.editHistory.push(freet.content);
            freet.content = content;
        }

        return freet;
    };

    /**
     * Deletes a Freet given an ID
     * @param {string} id - ID of Freet to delete
     * @return {Freet | undefined} - deleted Freet object
     */
    that.deleteFreet = id => {
        const freet = that.findFreetByID(id);
        let parentFreet = that.findFreetByID(freet.refreetOf);

        // Deletes regular freets that refreeted this freet (IMPORTANT: keep quoted freets)
        _data = _data.filter(f => {
            if (!f.refreetOf || f.refreetOf !== id) {
                return true;
            }

            return f.content;
        });

        // If there is a parentFreet --> Decrement counts for freets that this freet refreeted
        if (parentFreet) {
            parentFreet = parentFreet.content
                ? parentFreet
                : that.findFreetByID(parentFreet.refreetOf);

            parentFreet.freetsRefreetingThisFreet = parentFreet.freetsRefreetingThisFreet.filter(
                freet => freet.id !== id
            );
        }

        // Set parent field of freets that refreeted this freet (with quote only) to null and its content accordingly
        freet.freetsRefreetingThisFreet
            .filter(f => f.content)
            .forEach(f => {
                f.refreetOf = "deleted";
                f.editHistory = freet.editHistory;
            });

        _data = _data.filter(freet => freet.id !== id);

        return freet;
    };

    /**
     * Updates a Freet's author given an ID
     * @param {string} id - ID of Freet to update
     * @param {string} newName - new author name to assign ownership of the Freet
     * @return {Freet} - updated Freet object
     */
    that._updateFreetAuthor = (id, newName) => {
        const freet = that.findFreetByID(id);
        freet.author = newName;
        return freet;
    };

    /**
     * Finds the usernames of all refreeters of freet
     * @param {string} id - ID of Freet
     * @return {Array} - Array of usernames which refreeted the freet
     */
    that.getRefreeters = id => {
        const refreeters = _data
            .filter(freet => freet.refreetOf === id)
            .map(freet => freet.author);
        return refreeters;
    };

    /**
     * Helper function to return an array of valid JSON objects where each object represents a Freet
     * We don't want to show user objects in userLikingFreets since it introduces circular dependencies not applicable with JSON;
     * instead, just show each user's names that have liked this freet
     * @param {Array[Freet]} freets an array of Freets
     * @param {Boolean} canSeeUsersLikesAndRefreets true if the user should be able to see other users liking this freet and an array of refreets
     *                                              refreeting this freet else false
     * @return {Array[Freet]} Array of valid Freet JSON objects
     */
    that._convertToValidJSONFreets = (
        freets,
        canSeeUsersLikesAndRefreets = true
    ) => {
        return freets.map(freet => {
            const jsonFreetResult = {
                id: freet.id,
                author: freet.author,
                content: freet.content,
                editHistory: freet.editHistory,
                likes: freet.usersLikingFreet.length,
                numberOfRefreets: freet.freetsRefreetingThisFreet.length
            };

            const withLikes = canSeeUsersLikesAndRefreets
                ? {
                      ...jsonFreetResult,
                      usersLikingFreet: freet.usersLikingFreet.map(
                          user => user.name
                      ),
                      freetsRefreetingThisFreet: freet.freetsRefreetingThisFreet.map(
                          freet => freet.id
                      )
                  }
                : jsonFreetResult;

            const parentFreetID = freet.refreetOf;

            if (parentFreetID) {
                if (parentFreetID === "deleted") {
                    return {
                        ...withLikes,
                        parentFreetOriginalContent: "This Freet is unavailable."
                    };
                } else {
                    const parentFreet = that.findFreetByID(parentFreetID);
                    // If parentFreet is the original freet then return parentFreet's parentFreetOriginalContent and originalEditedContent via editHistory
                    if (!parentFreet.refreetOf) {
                        return {
                            ...withLikes,
                            parentFreetOriginalContent:
                                parentFreet.editHistory.length == 0
                                    ? parentFreet.content
                                    : parentFreet.editHistory[0],
                            parentFreetAuthor: parentFreet.author,
                            parentFreetLikes:
                                parentFreet.usersLikingFreet.length,
                            originalEditedContent:
                                parentFreet.editHistory.length == 0
                                    ? "The original freet has not been edited"
                                    : parentFreet.content
                        };
                    }

                    // else parentFreet is a quoted refreet and thus return via parent freet's content since it can't be edited
                    return {
                        ...withLikes,
                        parentFreetOriginalContent: parentFreet.content,
                        parentFreetAuthor: parentFreet.author,
                        parentFreetLikes: parentFreet.usersLikingFreet.length,
                    };
                }
            }

            return withLikes;
        });
    };

    Object.freeze(that);
    return that;
}

module.exports = Freets();
