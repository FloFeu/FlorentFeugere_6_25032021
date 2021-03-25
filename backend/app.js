const express = require('express');
const mongoose = require('mongoose');
const app = express();

const sauceRoutes = require('./routes/sauce');

mongoose.connect('mongodb+srv://floflo:test1@cluster0.czp7y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {   useNewUrlParser: true,
        useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

app.use('/api/sauces', sauceRoutes);

module.exports = app;