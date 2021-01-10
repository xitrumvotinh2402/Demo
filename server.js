const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require("cors");
require('dotenv').config();
const init = require("./utils/initMockupData");

// Configuring the database
const dbConfig = require('./config/database.js');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

global.__basedir = __dirname;
global.__host = host + ":" + port;


// create express app
const app = express();

var corsOptions = {
    origin: "*"
    // origin: "http://localhost:8080"
};
app.use(cors(corsOptions));

// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
mongoose.set('runValidators', true);

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// define a simple route
app.get('/', (req, res) => {
    res.json({ "message": "HELLO WORLD" });
});


//routes
require('./app/User/route')(app);

// listen for requests
// const host = process.env.HOST;
app.listen(port, host, () => {
    console.log(`Server is running on port ${port}. ${host}`)
});
init.mockupData();