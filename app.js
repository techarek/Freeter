const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const logger = require("morgan");
const cors = require("cors");
require('dotenv').config();
const history = require('connect-history-api-fallback');
const isProduction = process.env.NODE_ENV === 'production';
const freetsRouter = require("./routes/freets");
const indexRouter = require("./routes/index");
const sessionRouter = require("./routes/session");
const usersRouter = require("./routes/users");

const app = express();

// set up user session
app.use(
    session({
        secret: "URL-shortener",
        resave: true,
        saveUninitialized: true
    })
);

// allows us to make requests from POSTMAN
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(history());
app.use(express.static(path.join(__dirname, isProduction ? 'dist' : 'public')));

app.use("/", indexRouter);
app.use("/api/freets", freetsRouter);
app.use("/api/users", usersRouter);
app.use("/api/session", sessionRouter);
app.use("*", function(req, res) {
    res.status(404).send(
        `<h1> This page doesn't exist, please go back to the original site here \
    <a href="https://allisro-arkadius-fritter.herokuapp.com/">Fritter</a> </h1>`
    );
});

module.exports = app;
