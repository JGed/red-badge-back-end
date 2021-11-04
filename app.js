require('dotenv').config();
const express = require('express');

const db = require('./db');
const app = express();

const controllers = require('./controllers');
app.use(require('./middleware/headers'))
app.use(express.json());

app.use('/user', controllers.User);
app.use('/game', controllers.Game);
app.use('/review', controllers.Review);
app.use('/report', controllers.Report);

db.authenticate()
    .then(() => db.sync())
    .then(() => {
        app.listen(process.env.PORT, () => console.log('App is listening.'))
    })
    .catch(e => {
        console.log('server error');
        console.log(e);
    })