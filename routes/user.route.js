
const express = require('express');
const authJwt = require('../middlewares/authJwt')
const userController = require('../controllers/user.controller');
const router = express.Router();

router.get('/admin-list',[authJwt.verifyToken, authJwt.checkIfUserIsSuperAdmin],  userController.getAllAdmins);
router.get('/admin-number',[authJwt.verifyToken, authJwt.checkIfUserIsSuperAdmin],  userController.countAdmins);
router.get('/user-number',[authJwt.verifyToken, authJwt.checkIfUserIsSuperAdmin],  userController.countUser);
router.get('/approver-number',[authJwt.verifyToken, authJwt.checkIfUserIsSuperAdmin],  userController.countApprover);
router.get('/post-number',[authJwt.verifyToken, authJwt.checkIfUserIsSuperAdmin],  userController.countPost);


// check if the user is super-admin [in middleware]
router.post('/register-admin', [authJwt.verifyToken, authJwt.checkIfUserIsSuperAdmin],  userController.createAdmin);
router.route('/External-list').get(userController.Getrequest);

// check if the user is admin [in middleware]
router.get('/:_id', userController.getAdminById);
router.put('/update/:id',userController.updateAdmin);
router.delete('/delete/:id', userController.deleteAdmin);

//router.route('/accept/:name').post(userController.AcceptExternal);


module.exports = router;

