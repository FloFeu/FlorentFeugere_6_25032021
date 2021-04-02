"use strict";

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Modèle de base pour la création d'utilisateur
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true}, 
    password: {type: String, required: true}
});

// on vérifie que l'email n'est pas déja utilisé
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);