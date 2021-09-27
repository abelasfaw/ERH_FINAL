const express = require('express');
const externalUserController = require('../controllers/externalUser.controller');
const authJwt = require('../middlewares/authJwt')
const router = express.Router();

router.route('/request').post(externalUserController.AddEuser);
router.route('/get').get(externalUserController.List);



module.exports = router;