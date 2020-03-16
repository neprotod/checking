const express = require('express');
const corsMiddleware = require('cors');
const connectionDB = require('./src/db/mongodb');
const rootRout = require('./src/components');
const passport = require('passport');

const corsOptions = {
  exposedHeaders: 'X-Auth-Token',
};

// Start DB
connectionDB();

const app = express();
// Root routs
app.use(express.json());
app.use(corsMiddleware(corsOptions));
app.use(express.urlencoded({extended: true}));

app.use(express.static('./build'));

app.use(passport.initialize());
require('./src/auth/config/google')(passport);

app.use('/api', rootRout);

/* final catch-all route to index.html defined last */
app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/build/index.html');
})

module.exports = app;
