// Show an object on the screen.
function showObject(obj) {
    const pre = document.getElementById("response");
    const preParent = pre.parentElement;
    pre.innerText = JSON.stringify(obj, null, 4);
    preParent.classList.add("flashing");
    setTimeout(() => preParent.classList.remove("flashing"), 300);
}

// Axios responses have a lot of data. This shows only the most relevant data.
function showResponse(axiosResponse) {
    const fullResponse =
        axiosResponse.response === undefined
            ? axiosResponse
            : axiosResponse.response;
    const abridgedResponse = {
        data: fullResponse.data,
        status: fullResponse.status,
        statusText: fullResponse.statusText
    };
    showObject(abridgedResponse);
}

// IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE ABOVE

// EDIT THE CODE BELOW TO SEND REQUESTS TO YOUR API

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

/**
 * You can use axios to make API calls like this:
 * const body = { bar: 'baz' };
 * axios.post('/api/foo', body)
 *   .then(showResponse) // on success (Status Code 200)
 *   .catch(showResponse); // on failure (Other Status Code)
 * See https://github.com/axios/axios for more info
 */

// Hint: do not assume a 1:1 mapping between forms and routes

/**
 *
 * Calls the function makeRequest with the logged in user's username as input
 *
 * @param {function} makeRequest
 */
function makeRequestWithUsername(makeRequest) {
    axios
        .get("/api/session")
        .then(function(text) {
            let username = text.data;
            makeRequest(username);
        })
        .catch(showResponse);
}

function createUser(fields) {
    axios
        .post("/api/users", fields)
        .then(showResponse)
        .catch(showResponse)
        .finally(clearForm("create-user"));
}

function changeUsername(fields) {
    makeRequestWithUsername(username => {
        axios
            .put(`/api/users/${username}/username`, fields)
            .then(showResponse)
            .catch(showResponse)
            .finally(clearForm("change-username"));
    });
}

function changePassword(fields) {
    makeRequestWithUsername(username => {
        axios
            .put(`/api/users/${username}/password`, fields)
            .then(showResponse)
            .catch(showResponse)
            .finally(clearForm("change-password"));
    });
}

function deleteUser(fields) {
    makeRequestWithUsername(username => {
        axios
            .delete(`/api/users/${username}`, fields)
            .then(showResponse)
            .catch(showResponse);
    });
}

function signIn(fields) {
    axios
        .post("/api/session", fields)
        .then(showResponse)
        .catch(showResponse)
        .finally(clearForm("sign-in"));
}

function signOut(fields) {
    axios
        .delete("/api/session", fields)
        .then(showResponse)
        .catch(showResponse);
}

function viewAllFreets(fields) {
    axios
        .get("/api/freets", fields)
        .then(showResponse)
        .catch(showResponse);
}

function viewFreetsByAuthor(fields) {
    axios
        .get("/api/freets/" + fields.author, fields)
        .then(showResponse)
        .catch(showResponse)
        .finally(clearForm("view-freets-by-author"));
}

function createFreet(fields) {
    axios
        .post(`/api/freets/`, fields)
        .then(showResponse)
        .catch(showResponse)
        .finally(clearForm("create-freet"));
}
function editFreet(fields) {
    axios
        .put("/api/freets/" + fields.id, fields)
        .then(showResponse)
        .catch(showResponse)
        .finally(clearForm("edit-freet"));
}

function deleteFreet(fields) {
    axios
        .delete("/api/freets/" + fields.id, fields)
        .then(showResponse)
        .catch(showResponse)
        .finally(clearForm("delete-freet"));
}

function likeFreet(fields) {
    axios
        .patch(`/api/freets/${fields.id}/likes`, fields)
        .then(showResponse)
        .catch(showResponse)
        .finally(clearForm("like-freet"));
}

function viewFollowers(fields) {
    axios
        .get(`/api/users/${fields.username}/followers`, fields)
        .then(showResponse)
        .catch(showResponse);
}

function followUser(fields) {
    axios
        .patch(`/api/users/${fields.username}/following`, fields)
        .then(showResponse)
        .catch(showResponse)
        .finally(clearForm("follow-user"));
}

function viewFollowing(fields) {
    axios
        .get(`/api/users/${fields.username}/following`, fields)
        .then(showResponse)
        .catch(showResponse);
}

function viewFollowingUsersFreets(fields) {
    axios
        .get(`/api/users/${fields.username}/following/freets`, fields)
        .then(showResponse)
        .catch(showResponse);
}

function refreetQuote(fields) {
    axios
        .post(`/api/users/freets/${fields.id}/refreet-quote`, fields)
        .then(showResponse)
        .catch(showResponse)
        .finally(clearForm("refreet-quote"));
}

function refreet(fields) {
    axios
        .post(`/api/users/freets/${fields.id}/refreet`, fields)
        .then(showResponse)
        .catch(showResponse)
        .finally(clearForm("refreet"));
}

/**
 * Helper function to clear form after use (either as a result of a bad/good request)
 * @param {string} formElementID - ID of the form, as configured in index.html
 * @return {void}
 */
const clearForm = formElementID => {
    const formElement = document.getElementById(formElementID);
    formElement.reset();
};

// IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE BELOW

// map form (by id) to the function that should be called on submit
const formsAndHandlers = {
    "create-user": createUser,
    "delete-user": deleteUser,
    "change-username": changeUsername,
    "change-password": changePassword,
    "sign-in": signIn,
    "sign-out": signOut,
    "view-all-freets": viewAllFreets,
    "view-freets-by-author": viewFreetsByAuthor,
    "create-freet": createFreet,
    "edit-freet": editFreet,
    "delete-freet": deleteFreet,
    "like-freet": likeFreet,
    "follow-user": followUser,
    "view-followers": viewFollowers,
    "view-following": viewFollowing,
    "view-following-users-freets": viewFollowingUsersFreets,
    "refreet-quote": refreetQuote,
    refreet: refreet
};

// attach handlers to forms
function init() {
    Object.entries(formsAndHandlers).forEach(([formID, handler]) => {
        const form = document.getElementById(formID);
        form.onsubmit = e => {
            e.preventDefault();
            const data = {};
            new FormData(form).forEach((value, key) => {
                data[key] = value;
            });
            handler(data);
            return false; // don't reload page
        };
    });
}

window.onload = init; // attach handlers once DOM is ready
