// LOAD CONFIG
require("dotenv").config();

// DEPENDENCIES
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoSessionStore = require("connect-mongo")(session);



app.set('view engine', 'ejs');

// MIDDLEWARE
// body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// use css an js on ejs file
app.use(express.static("public"));
app.use(expressLayouts);

// Connect to database and pull in model(s)
mongoose.connect(
    process.env.MONGO_CONNECTION_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log(`MongoDb connected to ${process.env.MONGO_CONNECTION_URL}`)
);

app.use(session({
    store: new mongoSessionStore({ mongooseConnection: mongoose.connection }),
    saveUninitialized: true,
    resave: true,
    secret: "lambda's Super Secret Cookie",
    cookie: { maxAge: 30 * 60 * 1000 },
}))

app.get('/', (req, res) => {

    if (!req.session.userID) {
        res.redirect('/signUp')
    } else {
        res.redirect('/home')
    }

})

// routes
app.use(require('./routes/user'))
app.use(require('./routes/twitt'))




let Port = process.env.Port || 5000

app.listen(Port, () => console.log(`server twitter work now ${Port} `))