const express = require('express');
const authJwt = require('../middlewares/authJwt');
const multer = require('multer');
//const upload = require('../middlewares/upload');
const uploadController = require('../controllers/upload.controller');
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
   const imageFormats = /pdf/;
   const fileExt = file.mimetype.split("/")[1];
   const checkValidImageFormat = imageFormats.test(fileExt);

   if (checkValidImageFormat === true) {
       cb(null, true);
   } else {
       cb(new BadRequestHandler("Invalid image input", 401));
   }
};


const upload = multer({storage, multerFilter})


router.post("/upload/:username", upload.single('file'), [authJwt.verifyToken, authJwt.checkIfUserIsStudent], uploadController.UploadFile);
router.post("/approve/:postname",  [authJwt.verifyToken, authJwt.checkIfUserIsApprover],uploadController.ApprovePost);
router.post("/decline/:postname",  [authJwt.verifyToken, authJwt.checkIfUserIsApprover],uploadController.DeclinePost);
router.get("/history", uploadController.DeclineList)
// approver should fetch this
router.get("/upload-list", uploadController.uploadList);
// user should fetch this
router.get("/post", uploadController.postList);
router.get("/post-list", uploadController.FilterpostList);
//router.put("/like", uploadController.LikePost);
// router.put("/unlike", uploadController.UnlikePost);
router.put("/like/:id", [authJwt.verifyToken],uploadController.likePost);
router.get("/search", (req,res,next)=>{console.log("inside search handler"), next()},uploadController.search)
module.exports
 = router;
