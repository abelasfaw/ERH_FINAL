const express = require('express');
const router = express.Router();

router.post('/post-image', [upload.multerFilter, authJwt.checkIfUserIsUser])
router.post('/add-file')
