const express = require("express");
const departmentController = require("../controllers/department.controller");
const authJwt = require("../middlewares/authJwt");
const router = express.Router();

router.get(
    "/department-list",
    authJwt.verifyToken,
    authJwt.checkIfUserIsAdmin,
    departmentController.getDepartment
);

router.get("/department-list-all", departmentController.getAllDepartment);

router.get(
    "/department-list/:id",
    authJwt.verifyToken,
    authJwt.checkIfUserIsAdmin,
    departmentController.getDepartmentById
);
router.post(
    "/add-department",
    authJwt.verifyToken,
    authJwt.checkIfUserIsAdmin,
    departmentController.addDepartment
);
router.put(
    "/edit-department/:id",
    authJwt.verifyToken,
    authJwt.checkIfUserIsAdmin,
    departmentController.editDepartment
);
router.delete(
    "/delete-department/:id",
    authJwt.verifyToken,
    authJwt.checkIfUserIsAdmin,
    departmentController.deleteDepartment
);

module.exports = router;
