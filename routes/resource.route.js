const express = require('express');
const resourceController = require('../controllers/resource.controller');
const router = express.Router();
router.route('/:image_name').get(resourceController.getResource) 

module.exports = router;