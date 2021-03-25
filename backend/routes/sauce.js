const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce')
const auth = require('../middleware/auth');

router.post('/', auth, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/', auth, sauceCtrl.getAllSauce);

module.exports = router;