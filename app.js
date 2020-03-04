const express = require('express');
const corsMiddleware = require('cors');
const connectionDB = require('./src/db/mongodb');
const rootRout = require('./src/components');
const passport = require('passport');

// Start DB
connectionDB();

const app = express();
// Root routs
app.use(express.json());
app.use(corsMiddleware());
app.use(express.urlencoded({extended: true}));

app.use(passport.initialize());
require('./src/auth/config/google')(passport);

app.use('/api', rootRout);
module.exports = app;
