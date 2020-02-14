const express = require('express');
const connectionDB = require('./src/db/mongodb');
const rootRout = require('./src/components');

// Start DB
connectionDB();

const app = express();

// Root routs
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', rootRout);

module.exports = app;
