"use strict";

const Sauce = require('../models/sauce');
const fs = require('fs');


exports.createSauce = (req, res, next) => {
    if (req.body == null) {
        res.status(400).json({ message: "Erreur dans la requête"});
        res.end();
    };
    // 
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
        .catch(error => res.status(400).json({ error }));

};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? //opérateur ternaire pour vérifier si la requête contient une nouvelle image
    {   
        ...JSON.parse(req.body.sauce),                                                  //S'il y a une nouvelle image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
     } : { ...req.body };
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
                .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error}));                                                
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error}))
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    
    const like = req.body.like;
    const userId = req.body.userId;

    if (like == 1 ) {
        Sauce.updateOne({_id: req.params.id}, {$inc: {likes: 1}, $push: {usersLiked: userId}})
            .then(() => res.status(200).json({message: 'Vous aimez cette sauce !'}))
            .catch(error => res.status(400).json({ error })); 
    } else if (like == -1) {
        Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: 1}, $push: {usersDisliked: userId}} )
            .then(() => res.status(200).json({message: "Vous n'aimez pas cette sauce !"}))
            .catch(error => res.status(400).json({ error })); 
    } else if (like == 0) {
        Sauce.findOne({_id: req.params.id})
            .then((sauce) => {
                if (sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: userId}})
                     .then(() => res.status(200).json({message: "Vous n'aimez plus cette sauce !"}))
                     .catch(error => res.status(500).json({ error }));
                } if (sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}, $pull: {usersDisliked: userId}})
                     .then(() => res.status(200).json({message: "Vous aimez de nouveau cette sauce !"}))
                     .catch(error => res.status(500).json({ error }));
                }
            })
            .catch(error => res.status(500).json({ error }));
        }
};

