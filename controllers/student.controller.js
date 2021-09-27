const User = require("../models/user.model");
const Student = require("../models/student.model");
const Admin = require("../models/admin.model");
const Upload = require("../models/upload.model");

exports.createClientProfile = async (req, res) => {
    const username = req.params.username;
    const { email, gender, academiclevel, year, department } = req.body;
    const profilepicture = req.file.filename;
    let profilePicLink =
        `localhost:${process.env.APP_PORT}/resource/` + profilepicture;

    if (!email) {
        return res.status(401).json({
            status: "fail",
            message: "please provide email",
        });
    }

    if (!gender) {
        return res.status(401).json({
            status: "fail",
            message: "please provide your gender",
        });
    }

    const user = await User.findOne({ username });

    if (user.Student)
        return res.status(400).json({
            status: "fail",
            message: "user exists",
        });

    let newStudent = new Student({
        username: user.username,
        name: user.name,
        email,
        gender,
        profilepicture: profilePicLink,
        academiclevel,
        year,
        department: department,
        createdBy: user.createdBy,
        changeProfile: false,
    });

    newStudent.user = user._id;
    user.student = newStudent._id;
    user.profileCreated = true;
    user.changeProfile = false;
    user.studentId = newStudent._id;

    await newStudent.save();
    await user.save();

    res.status(200).json({
        status: "success",
        message: "Profile successfully created",
        data: newStudent,
    });
};

exports.getUserProfile = async (req, res) => {
    const students = await Student.find({}).populate("institute", "uploads");
    res.json({ students });
};

// count post
exports.countPost = async (req, res) => {
    const student = await Student.findOne({ user: req.userId });
    Upload.countDocuments({ uploader: student._id })
        .then((uploader) => res.json(uploader))
        .catch((err) => res.status(400).json("Error:" + err));
    console.log(req.userId);
};

exports.showUserProfile = async (req, res) => {
    const _id = req.params._id;
    Student.findById(_id)
        .populate("department")
        .then((data) => {
            if (!data) res.status(404).send({ message: "id not found" + _id });
            else res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: "error retriving with id" + _id,
            });
        });
};

exports.updateProfile = (req, res) => {
    const {
        firstname,
        lastname,
        gender,
        profilePicture,
        phone,
        email,
        academiclevel,
        year,
    } = req.body;
    const id = req.params.id;
    const newData = {
        firstname,
        lastname,
        gender,
        profilePicture,
        phone,
        email,
        academiclevel,
        year,
        institute: institute._id,
        changeProfile: false,
    };

    Student.updateOne({ _id: id }, newData)
        .then(() => {
            res.status(201).json({
                message: "updated successfully!",
            });
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};
//follow user
exports.addFollower = async (req, res, next) => {
    try {
        let student = await Student.findById(req.userId);
        console.log(student.following);
        if (student) {
            for (var i = 0; i < student.following.length; i++) {
                if (student.following[i] == req.params["id"].toString()) {
                    return res.json({
                        success: false,
                        data: {
                            message: "Following User",
                        },
                    });
                }
            }

            let stat = await student.updateOne({
                $push: { following: req.params["id"] },
            });
            let follower = Student.findById(req.params["id"]);
            let status = await follower.updateOne({
                $push: { followers: req.userId },
            });
        }
        return res.json({
            success: true,
            data: {
                message: "User followed",
            },
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};
exports.removeFollower = async (req, res, next) => {
    try {
        let student = await Student.findById(req.userId);
        console.log(student.following);
        if (student) {
            for (var i = 0; i < student.following.length; i++) {
                if (student.following[i] == req.params["id"].toString()) {
                    return res.json({
                        success: false,
                        data: {
                            message: "Following User",
                        },
                    });
                }
            }

            let stat = await student.updateOne({
                $pull: { following: req.params["id"] },
            });
            let follower = Student.findById(req.params["id"]);
            let status = await follower.updateOne({
                $pull: { followers: req.userId },
            });
        }
        return res.json({
            success: true,
            data: {
                message: "User followed",
            },
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

// const addFollower = async (req, res) => {
//   try{
//     let result = await Student.findByIdAndUpdate(req.body.followId, {$push: {followers: req.body.userId}}, {new: true})
//                             .populate('following', '_id name')
//                             .populate('followers', '_id name')
//                             .exec()
//       result.hashed_password = undefined
//       result.salt = undefined
//       res.json(result)
//     }catch(err) {
//       return res.status(400).json({
//         error: errorHandler.getErrorMessage(err)
//       })
//     }
// }

// const removeFollowing = async (req, res, next) => {
//   try{
//     await User.findByIdAndUpdate(req.body.userId, {$pull: {following: req.body.unfollowId}})
//     next()
//   }catch(err) {
//     return res.status(400).json({
//       error: errorHandler.getErrorMessage(err)
//     })
//   }
// }
// const removeFollower = async (req, res) => {
//   try{
//     let result = await User.findByIdAndUpdate(req.body.unfollowId, {$pull: {followers: req.body.userId}}, {new: true})
//                             .populate('following', '_id name')
//                             .populate('followers', '_id name')
//                             .exec()
//     result.hashed_password = undefined
//     result.salt = undefined
//     res.json(result)
//   }catch(err){
//       return res.status(400).json({
//         error: errorHandler.getErrorMessage(err)
//       })
//   }
// }
