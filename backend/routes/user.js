"use strict";

const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

const rateLimit = require('express-rate-limit'); // Mise en place d'une limite de requêtes répétées vers l'API.

// Limite de création de comptes fixée à 5 par heure.
const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5
}); 

// Limite de connexions fixée à 3 par tranches de 15 minutes. 
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3 
})

router.post('/signup', createAccountLimiter, userCtrl.signup);
router.post('/login', loginLimiter, userCtrl.login);

module.exports = router;