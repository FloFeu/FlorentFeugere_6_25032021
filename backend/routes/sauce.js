"use strict";

const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce')

// Middleware pour s'assurer de l'identité de l'utilisateur
const auth = require('../middleware/auth');

// Middleware de gestion des images
const multer = require('../middleware/multer-config');

// Méthodes pour les sauces avec middlewares
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce)

module.exports = router;