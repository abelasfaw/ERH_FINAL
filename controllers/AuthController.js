const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
//const User = require("../models/user.model");
const { SECRET } = require("../config");
const User = require("../models/user.model");
const Admin = require("../models/admin.model");
const Student = require("../models/student.model");

const userLogin = async (req, res) => {
    let { username, password } = req.body;
    // First Check if the username is in the database

    const user = await User.findOne({ username });
    var isStudent = false;
    if (!user) {
        return res.status(404).json({
            message: "Username is not found. Invalid login credentials.",
            success: false,
        });
    }
    // That means user is existing and trying to signin fro the right portal
    // Now check for the password
    let isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        // Sign in the token and issue it to the user
        console.log(user);

        let type = 0;
        if (!user.profileCreated) {
            var token = jwt.sign(
                {
                    user_id: user._id,
                    role: user.role,
                    username: user.username,
                    // email: user.email
                },
                SECRET,
                { expiresIn: "7 days" }
            );
        } else if (user.profileCreated && user.student != null) {
            console.log("inside student");
            isStudent = true;
            let student_id = user.student;
            var student = await Student.findOne({ _id: student_id });
            var token = jwt.sign(
                {
                    user_id: student._id,
                    role: user.role,
                    username: user.username,
                    // email: user.email
                },
                SECRET,
                { expiresIn: "7 days" }
            );
        } else if (user.profileCreated && user.institute != null) {
            console.log("inside admin");
            let institute = user.institute;
            var admin = await Admin.findOne({ _id: institute });
            var token = jwt.sign(
                {
                    user_id: admin._id,
                    role: user.role,
                    username: user.username,
                    // email: user.email
                },
                SECRET,
                { expiresIn: "7 days" }
            );
        }

        let id = null;
        if (isStudent) {
            id = student._id;
        } else {
            id = user._id;
        }

        let result = {
            ...user.toJSON(),
            token,
            expiresIn: 168,
        };

        return res.status(200).json({
            ...result,
            message: "You are now logged in.",
            success: true,
        });
    } else {
        return res.status(403).json({
            message: "Incorrect username or password.",
            success: false,
        });
    }

    // else if(user.student != null){
    //   console.log("Auth student")
    //   let student_id = user.student
    //   var student = await Student.findOne({_id:student_id})
    //   type = 2
    //   console.log("stud " + student)
    // }
    // else if (user.institute != null){
    //   console.log("Auth admin")
    //   let institue = user.institute
    //   var admin = await Admin.findOne({_id:institue})
    //   type = 1
    //   console.log("admin  " +  admin)

    // }

    // if(type == 1) {
    //   if(user.profileCreated) {
    //     var token = jwt.sign(
    //       {
    //         user_id: admin._id,
    //         role: user.role,
    //         username: user.username,
    //         // email: user.email
    //       },
    //       SECRET,
    //       { expiresIn: "7 days" }
    //     );
    //   }
    //   else {
    //     var token = jwt.sign(
    //       {
    //         user_id: user._id,
    //         role: user.role,
    //         username: user.username,
    //         // email: user.email
    //       },
    //       SECRET,
    //       { expiresIn: "7 days" }
    //     );

    //   }

    // }
    // else if(type ==2) {
    //   if(user.profileCreated){
    //     var token = jwt.sign(
    //       {
    //         user_id: student._id,
    //         role: user.role,
    //         username: user.username,
    //         // email: user.email
    //       },
    //       SECRET,
    //       { expiresIn: "7 days" }
    //     );
    //   }
    //   else {
    //     var token = jwt.sign(
    //       {
    //         user_id: user._id,
    //         role: user.role,
    //         username: user.username,
    //         // email: user.email
    //       },
    //       SECRET,
    //       { expiresIn: "7 days" }
    //     );
    //   }

    // }
    // else {
    //   var token = jwt.sign(
    //     {
    //       user_id: user._id, //to be changed
    //       role: user.role,
    //       username: user.username,
    //       // email: user.email
    //     },
    //     SECRET,
    //     { expiresIn: "7 days" }
    //   );

    // }

    // let result = {
    //   username: user.username,
    //   role: user.role,
    //   email: user.email,
    //   changeProfile: user.changeProfile,
    //   token: `${token}`,
    //   expiresIn: 168
    // };

    // return res.status(200).json({
    //   ...result,
    //   message: "You are now logged in.",
    //   success: true
    // });
};

const validateUsername = async (username) => {
    let user = await User.findOne({ username });
    return user ? false : true;
};

/**
 * @DESC Passport middleware
 */
const userAuth = passport.authenticate("jwt", { session: false });

/**
 * @DESC Check Role Middleware
 */
const checkRole = (roles) => (req, res, next) =>
    !roles.includes(req.user.role)
        ? res.status(401).json("Unauthorized")
        : next();

const serializeUser = (user) => {
    return {
        username: user.username,
        _id: user._id,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
    };
};

module.exports = {
    userAuth,
    checkRole,
    userLogin,
    serializeUser,
};
