"use strict";

// Package qui vérifie les tokens d'authentification
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Récupération de la partie token dans le header "BEARER TOKEN"
        const token = req.headers.authorization.split(' ')[1];
        // Décodage du token avec la clé utilisée pour créer le token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // Récupération de l'userId dans le token décodé
        const userId = decodedToken.userId;
        
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User Id non valable !';
        } else {
            res.header('Authorization', 'BEARER ' + token);
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !'})
    }
};