const Department = require("../models/department.model");

exports.getDepartment = (req, res) => {
    Department.find({ createdBy: req.userId })
        .populate("approvers")
        .then((departments) => {
            res.json(departments);
        })
        .catch((err) => res.status(400).json("Error:" + err));
};

exports.getAllDepartment = (req, res) => {
    Department.find({})
        .populate("approvers")
        .then((departments) => {
            res.json(departments);
        })
        .catch((err) => res.status(400).json("Error:" + err));
};

exports.getDepartmentById = (req, res) => {
    const { id } = req.params;
    Department.findOne({ _id: id, createdBy: req.userId })
        .then((department) => res.json(department))
        .catch((err) => res.status(400).json("Error:" + err));
};

// add department

exports.addDepartment = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(401).json({
            status: "fail",
            message: "please provide department",
        });
    }

    const department = await Department.findOne({ name });

    if (department) {
        return res.status(400).json({
            status: "fail",
            message: "department already exists",
        });
    }

    const newDepartment = new Department({ name, createdBy: req.userId });
    await newDepartment.save();
    return res.status(201).json({
        status: "success",
        message: "registration successful",
        data: newDepartment,
    });
};

exports.editDepartment = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const department = await Department.updateOne({ _id: id }, { name });
        res.status(200).json({
            status: "success",
            message: "department edited",
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: "error deleting department",
        });
    }
};

exports.deleteDepartment = async (req, res) => {
    const { id } = req.params;
    try {
        await Department.deleteOne({ _id: id });
        res.status(200).json({
            status: "success",
            message: "department deleted",
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: "error deleting department",
        });
    }
};
