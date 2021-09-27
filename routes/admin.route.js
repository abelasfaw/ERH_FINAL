const express = require("express");
const adminContoller = require("../controllers/admin.controller");
const authJwt = require("../middlewares/authJwt");
const router = express.Router();
const upload = require("../middlewares/upload");

router.post("/add-profile/:id", upload, adminContoller.createInstituteDetail);
router.route("/profile/:id").get(adminContoller.showProfileById);
router.get(
    "/profile",
    [authJwt.verifyToken, authJwt.checkIfUserIsAdmin],
    adminContoller.showProfile
);
router.put("/updateProfile/:id", adminContoller.updateProfile);

// manage users
router.get(
    "/user-list",
    [authJwt.verifyToken, authJwt.checkIfUserIsAdmin],
    adminContoller.getUsers
);
router.get(
    "/user-list/:id",
    [authJwt.verifyToken, authJwt.checkIfUserIsAdmin],
    adminContoller.getUserById
);
router.post(
    "/register-user",
    [authJwt.verifyToken, authJwt.checkIfUserIsAdmin],
    adminContoller.createUser
);
router.put(
    "/edit-user/:id",
    [authJwt.verifyToken, authJwt.checkIfUserIsAdmin],
    adminContoller.updateUser
);

router.delete(
    "/delete-user/:id",
    [authJwt.verifyToken, authJwt.checkIfUserIsAdmin],
    adminContoller.deleteUser
);

// approver
router.get(
    "/approver-list",
    [authJwt.verifyToken, authJwt.checkIfUserIsAdmin],
    adminContoller.getApprovers
);
router.get(
    "/approver-list/:id",
    [authJwt.verifyToken, authJwt.checkIfUserIsAdmin],
    adminContoller.getApproverById
);
router.post(
    "/register-approver",
    [authJwt.verifyToken, authJwt.checkIfUserIsAdmin],
    adminContoller.createApprover
);
router.delete(
    "/delete-approver/:id",
    [authJwt.verifyToken, authJwt.checkIfUserIsAdmin],
    adminContoller.deleteApprover
);

// external user
router.get(
    "/externaluser-list/",
    [authJwt.verifyToken, authJwt.checkIfUserIsAdmin],
    adminContoller.getExternalUsers
);

router.get(
    "/externaluser-list/:id",
    [authJwt.verifyToken, authJwt.checkIfUserIsAdmin],
    adminContoller.getUserById
);

router.put(
    "/edit-externaluser/:id",
    [authJwt.verifyToken, authJwt.checkIfUserIsAdmin],
    adminContoller.updateUser
);

router.delete(
    "/delete-externaluser/:id",
    [authJwt.verifyToken, authJwt.checkIfUserIsAdmin],
    adminContoller.deleteUser
);
router.post(
    "/add-department",
    authJwt.verifyToken,
    authJwt.checkIfUserIsAdmin,
    adminContoller.addDepartment
);

router.route("/profiles").get(adminContoller.getAdminProfile);
router.get(
    "/total-user",
    [authJwt.verifyToken, authJwt.checkIfUserIsAdmin],
    adminContoller.countUser
);
router.get(
    "/total-approver",
    [authJwt.verifyToken, authJwt.checkIfUserIsAdmin],
    adminContoller.countApprover
);
router.get(
    "/total-post",
    [authJwt.verifyToken, authJwt.checkIfUserIsAdmin],
    adminContoller.countPost
);

router.post(
    "/register-externaluser/:name",
    [authJwt.verifyToken, authJwt.checkIfUserIsAdmin],
    adminContoller.AddExternal
);

router.get(
    "/post-under",
    [authJwt.verifyToken, authJwt.checkIfUserIsAdmin],
    adminContoller.getPostsUnderAdmin
);

router.get("/getAdmin/:username", adminContoller.showProfileByusername);
router.put("/update/:id", adminContoller.updateUser);
router.delete("/delete/:id", adminContoller.deleteProfile);
router.route("/External-list").get(adminContoller.GetExternalUser);
router.route("/logout").get(adminContoller.Logout);

// router.get('/AdminList', adminContoller.AdminList);

module.exports = router;
