"use strict";

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Package qui masque les données 
const MaskData = require('maskdata');

// Express-validator 
const { body, validationResult } = require('express-validator');


exports.signup = (req, res, next) => {
    // Récupération des erreurs de validation dans la requête pour les mettre dans un objet 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    };

    // Cryptage du mot de passage avec 10 salages pour renforcer le cryptage.
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                // Utilisation de MaskData pour masquer l'email dans la BDD
                email: MaskData.maskEmail2(req.body.email),
                password: hash
            });
            // Sauvegarde du nouvel utilisateur dans la BDD grâce à la fonction asynchrone save() de mongoose
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    // Recherche de l'utilisateur avec findOne() en comparant l'email avec ceux enregistrés
    User.findOne({ email: MaskData.maskEmail2(req.body.email) })
        .then(user => {
            //Renvoi d'erreur si l'utilisateur n'est pas trouvé
            if (!user) {
                return res.status(401).json({ error: `Utilisateur non trouvé: ${req.body.email} !`})
            }
            //comparaison du mot de passe rentré avec celui crypté dans la BDD
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !'});
                    }
                    res.status(200).json(
                        {
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};