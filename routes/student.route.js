const express = require('express');
const multer  = require('multer');
const authJwt = require('../middlewares/authJwt');
// const {upload} = require('../middlewares/upload');
const studentController = require('../controllers/student.controller');
const router = express.Router();

const storage = multer.diskStorage({
   destination: function(req, file, cb) {
      cb(null, 'public/')
   },
   filename: function(req, file, cb) {
      const uniqueSuffix = Date.now();
      const ext = file.mimetype.split('/')[1]
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext)
   }
})
const multerFilter = (req, file, cb) => {
   const imageFormats = /jpg|jpeg|png/;
   const fileExt = file.mimetype.split("/")[1];
   const checkValidImageFormat = imageFormats.test(fileExt);

   if (checkValidImageFormat === true) {
       cb(null, true);
   } else {
       cb(new BadRequestHandler("Invalid image input", 401));
   }
};


const upload = multer({storage, multerFilter})


router.post("/add-profile/:username", upload.single('profilePicture'),  [authJwt.verifyToken, authJwt.checkIfUserIsUser], studentController.createClientProfile);
router.put('/updateProfile/:id', studentController.updateProfile);
router.get('/student-list', studentController.getUserProfile);
router.get('/student/:_id', studentController.showUserProfile);
router.get('/post', [authJwt.verifyToken, authJwt.checkIfUserIsUser], studentController.countPost);
router.get('/follow/:id',[authJwt.verifyToken],studentController.addFollower);
router.get('/unfollow/:id',[authJwt.verifyToken],studentController.removeFollower);
router.post('/uploads', upload.single('profilePicture'), (req, res) => {
   res.json({
      file: req.file,
      body: req.body
   })
})

/**
 * GET profile/:id
 * const x = {
 *    firstname
 *    lastname
 *    path;
 * }
 * 
 * x.path = "path"
 * 
 */
module.exports = router;

// router.get('/hello', middleware, controller)