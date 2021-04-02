"use strict";

const express = require('express');
const mongoose = require('mongoose');

const path = require('path');

// Package qui créée des logs de ce qui se passe 
const morgan = require('morgan'); 

// Sécurisation de l'app avec Helmet, qui configure des headers HTTP variés
const helmet = require('helmet');

require('dotenv').config();

// Déclaration des variables pour la connexion à la database
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_ACCESS = process.env.DB_ACCESS;

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// Connexion à la database
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_ACCESS}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// Middleware ajoutant les headers nécessaires pour la communication entre le frontend et le backend
app.use((req, res, next) => {
    // accepte les requêtes de n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    // indique quels headers HTTP peuvent être utilisés durant la requête
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // autorise l'utilisation des méthodes suivantes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Prévention des attaques
app.use(helmet());          

app.use(morgan('combined'));

// Anciennement body-parser
app.use(express.json());

// Enregistrement des fichiers statiques dans le dossier images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Mise en place des routes pour l'API
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;