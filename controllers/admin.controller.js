const User = require("../models/user.model");
const Student = require("../models/student.model");
const Approver = require("../models/approver.model");
const Department = require("../models/department.model");
const External = require("../models/externalUser.model");
const Post = require("../models/upload.model");
const Admin = require("../models/admin.model");
const bcrypt = require("bcryptjs");

//const ExternalUser = require('../models/externalUser.model');
const { eventNames } = require("../models/admin.model");
const Upload = require("../models/upload.model");
//Admin.ensureIndexes({name:"text"});

//dashbord part

// get total number of students

exports.countUser = async (req, res) => {
    Student.countDocuments({ createdBy: req.userId })
        .then((institute) => res.json(institute))
        .catch((err) => res.status(400).json("Error:" + err));
};

exports.countApprover = async (req, res) => {
    Approver.countDocuments({ createdBy: req.userId })
        .then((institute) => res.json(institute))
        .catch((err) => res.status(400).json("Error:" + err));
};

// get total number of post
exports.countPost = async (req, res) => {
    Upload.countDocuments({ institute: req.userId, state: "post" })
        .then((institute) => res.json(institute))
        .catch((err) => res.status(400).json("Error:" + err));
};
//create admin profile
exports.createInstituteDetail = async (req, res) => {
    const id = req.params.id;
    console.log({ id });
    const { address, phone, email, under } = req.body;

    if (!address) {
        return res.status(401).json({
            status: "fail",
            message: "Please provide address",
        });
        // finish the rest of the validation
    }

    if (!phone) {
        return res.status(401).json({
            status: "fail",
            message: "please provide phone",
        });
    }

    if (!email) {
        return res.status(401).json({
            status: "fail",
            message: "please provide email",
        });
    }

    if (!under) {
        return res.status(401).json({
            status: "fail",
            message: "please provide Region/Under",
        });
    }

    try {
        const user = await User.findOne({ _id: id });
        if (!user) {
            res.status(404).json({
                status: "fail",
                message: "user not found",
            });
        }

        console.log(user);

        if (user.instituteId) {
            return res.status(400).json({
                status: "fail",
                message: "Profile already existed",
            });
        }

        // 1- create new object
        let newAdmin = new Admin({
            username: user.username,
            name: user.name,
            profilePicture: "",
            address,
            phone,
            email,
            under,
            changeProfile: false,
        });

        // 2- maintain 1-1 relationship
        newAdmin.userId = user._id;
        user.instituteId = newAdmin._id;
        user.changeProfile = false;
        user.profileCreated = true;

        // 3- save each models
        await newAdmin.save();
        await user.save();

        res.status(200).json({
            status: "success",
            message: "Profile successfully created",
            data: newAdmin,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            err,
        });
    }
};
exports.showProfileByusername = async (req, res) => {
    const username = req.params.username;
    Admin.findOne({ username: username })
        .then((data) => {
            if (!data)
                res.status(404).send({ message: "id not found" + username });
            else res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: "error retriving with id" + username,
            });
        });
};

exports.showProfile = async (req, res) => {
    const id = req.userId;
    Admin.findOne({ _id: id })
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "id not found " + id });
            } else {
                res.json(data);
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "error retriving with id " + id,
            });
        });
};

exports.showProfileById = async (req, res) => {
    const id = req.params.id;
    Admin.findOne({ _id: id })
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "id not found " + id });
            } else {
                res.json(data);
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "error retriving with id " + id,
            });
        });
};

exports.getAdminProfile = async (req, res) => {
    const users = await User.find({ role: "admin" }).populate("institute");
    res.json({ users });
};

exports.getUsers = (req, res) => {
    Student.find({
        externalUser: false,
        changeProfile: false,
        createdBy: req.userId,
    })
        .then((users) => res.json(users))
        .catch((err) => res.status(400).json("Error:" + err));
};

exports.getExternalUsers = (req, res) => {
    Student.find({
        externalUser: true,
        changeProfile: false,
        createdBy: req.userId,
    })
        .then((users) => res.json(users))
        .catch((err) => res.status(400).json("Error:" + err));
};
exports.getApprovers = (req, res) => {
    Approver.find({ role: "approver", createdBy: req.userId })
        .then((approvers) => res.json(approvers))
        .catch((err) => res.status(400).json("Error:" + err));
};

exports.createUser = async (req, res) => {
    let { name, username, password, externalUser, role } = req.body;

    if (!username) {
        res.status(400).json({
            status: "fail",
            message: "Provide username",
        });
    } else if (!name) {
        res.status(400).json({
            status: "fail",
            message: "Provide name",
        });
    } else if (!password) {
        res.status(400).json({
            status: "fail",
            message: "Provide password",
        });
    } else if (!role) {
        res.status(400).json({
            status: "fail",
            message: "User type should be specified",
        });
    }

    role = role.toLowerCase();

    if (role === "user") {
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({
                status: "fail",
                message: "User already registered",
            });
        }

        let newUser = new User({
            name,
            username,
            password,
            role,
            externalUser,
            createdBy: req.userId,
        });

        newUser
            .save()
            .then((data) => {
                res.status(201).json({
                    status: "success",
                    message: "registration successful",
                    data,
                });
            })
            .catch((err) => {
                res.status(201).json({
                    status: "fail",
                    message: err,
                });
            });
    }
};
exports.createApprover = async (req, res) => {
    const { name, username, password, role, department } = req.body;

    if (!name) {
        return res.status(400).json({
            status: "fail",
            message: "Provide name",
        });
    } else if (!username) {
        res.status(400).json({
            status: "fail",
            message: "Provide username",
        });
    } else if (!password) {
        res.status(400).json({
            status: "fail",
            message: "Provide password",
        });
    } else if (!role) {
        res.status(400).json({
            status: "fail",
            message: "User type should be specified",
        });
    } else if (!department) {
        res.status(400).json({
            status: "fail",
            message: "Department should be specified",
        });
    }

    if (role === "approver") {
        const dep = await Department.findOne({ _id: department });
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({
                status: "fail",
                message: "User already registered",
            });
        }

        let newUser = new User({
            name,
            username,
            password,
            role,
            createdBy: req.userId,
            changeProfile: false,
        });

        let newapprover = new Approver({
            name,
            username,
            password,
            role,
            departmentId: dep._id,
            createdBy: req.userId,
            userId: newUser._id,
        });

        newUser.approverId = newapprover._id;

        if (dep.approvers.length < 3) {
            dep.approvers.push(newapprover);
            await newUser.save();
            await newapprover.save();
            await dep.save();
        } else {
            return res.status(500).json({
                status: "fail",
                message: "Can't register more then 3 approvers in a department",
            });
        }

        return res.status(200).json({
            status: "success",
            message: "registration successful",
        });
    }
};

exports.getUserById = (req, res) => {
    const id = req.params.id;
    Student.findOne({ _id: id, createdBy: req.userId })
        .then((data) => {
            if (!data) res.status(404).send({ message: "id not found " + id });
            else res.json(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: "error retriving with id " + id,
            });
        });
};
exports.getApproverById = (req, res) => {
    const id = req.params.id;
    Approver.findOne({ _id: id, createdBy: req.userId })
        .then((data) => {
            if (!data) res.status(404).send({ message: "id not found " + id });
            else res.json(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: "error retriving with id " + id,
            });
        });
};

exports.getPostsUnderAdmin = async (req, res) => {
    try {
        const posts = await Upload.find({
            institute: req.userId,
            state: "post",
        });
        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, data: error });
    }
};

exports.updateUser = async (req, res) => {
    const id = req.params.id;
    const { password, username } = req.body;
    let newData;
    try {
        const studentToUpdate = await Student.findOne({
            _id: id,
            createdBy: req.userId,
        });

        if (password) {
            newData = { password: bcrypt.hashSync(password, 12), username };
        } else {
            const userInfo = await User.findOne({
                _id: studentToUpdate.user,
                createdBy: req.userId,
            });
            newData = { username, password: userInfo.password };
        }

        await Student.updateOne({ _id: id, createdBy: req.userId }, newData);
        await User.updateOne(
            {
                _id: studentToUpdate.user,
                createdBy: req.userId,
            },
            newData
        );
        res.status(200).json({
            status: "success",
            message: "Student updated!",
        });
    } catch (error) {
        res.status(400).json({
            error: error,
        });
    }
};

exports.updateProfile = (req, res) => {
    const id = req.params.id;
    const { name, profilePicture, address, phone, email, under } = req.body;
    const newData = { name, profilePicture, address, phone, email, under };

    Admin.updateOne({ _id: id }, newData)
        .then((data) => {
            res.status(201).json({
                message: "profile updated successfully!",
            });
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const studentToDelete = await Student.findOne({
            _id: id,
            createdBy: req.userId,
        });
        await Student.deleteOne({ _id: id, createdBy: req.userId });
        await User.deleteOne({
            _id: studentToDelete.user,
            createdBy: req.userId,
        });
        res.status(200).json({
            status: "success",
            message: "Student Deleted!",
        });
    } catch (error) {
        res.status(400).json({
            error: error,
        });
    }
};

exports.deleteApprover = async (req, res) => {
    const { id } = req.params;
    try {
        const approverToDelete = await Approver.findOne({
            _id: id,
            createdBy: req.userId,
        });
        await Approver.deleteOne({ _id: id, createdBy: req.userId });
        await User.deleteOne({
            _id: approverToDelete.userId,
            createdBy: req.userId,
        });
        res.status(200).json({
            status: "success",
            message: "Approver Deleted!",
        });
    } catch (error) {
        res.status(400).json({
            error: error,
        });
    }
};

exports.deleteProfile = (req, res) => {
    Admin.deleteOne({ _id: req.params.id })
        .then(() => {
            res.status(200).json({
                message: "Deleted!",
            });
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};

// add department

exports.addDepartment = async (req, res) => {
    const { department } = req.body;

    if (!department) {
        return res.status(401).json({
            status: "fail",
            message: "please provide phone",
        });
    }

    let newDep = new Department({ department });

    await newDep.save().then(() => {
        return res.status(200).json({
            status: "succes",
            message: "registration successful",
        });
    });
};

exports.GetExternalUser = async (req, res) => {
    const external = await External.find({});
    res.json(external);
};
// add accepted external user to the system
exports.AddExternal = async (req, res) => {
    const name = req.params.name;
    const { username, password, passwordConfirm, role } = req.body;
    if (!username) {
        res.status(400).json({
            status: "fail",
            message: "Provide username",
        });
    } else if (!password || !passwordConfirm) {
        res.status(400).json({
            status: "fail",
            message: "Provide password",
        });
    } else if (!role) {
        res.status(400).json({
            status: "fail",
            message: "User type should be specified",
        });
    }

    if (password !== passwordConfirm) {
        res.status(400).json({
            status: "fail",
            message: "Password should match",
        });
    }

    // role = role.toLowerCase();

    if (role === "user") {
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({
                status: "fail",
                message: "User already registered",
            });
        }

        let newUser = new User({
            name,
            username,
            password,
            passwordConfirm,
            role,
        });

        await newUser.save().then(() => {
            return res.status(200).json({
                status: "succes",
                message: "registration successful",
            });
        });
    }
};
exports.Logout = async (req, res) => {
    req.logout();
    res.redirect("/");
};
