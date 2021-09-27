const mongoose = require("mongoose");

const Schema = mongoose.Schema;

require("mongoose-type-email");

const StudentSchema = new Schema(
    {
        username: {
            type: String,
        },
        name: {
            type: String,
        },
        gender: {
            type: String,
        },
        department: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Department",
        },

        institute: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },
        createdBy: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Admin",
        },

        uploads: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Upload",
            },
        ],
        profilepicture: {
            type: String,
        },
        email: mongoose.SchemaTypes.Email,
        academiclevel: {
            type: String,
        },
        phone: {
            type: String,
        },
        year: {
            type: Date,
        },
        date: {
            type: Date,
            default: Date.now(),
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        changeProfile: {
            type: Boolean,
            default: true,
        },
        externalUser: {
            type: Boolean,
            default: false,
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student",
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student",
            },
        ],
        like1: {
            type: String,
        },
        like2: {
            type: String,
        },
        like3: {
            type: String,
        },
        like4: {
            type: String,
        },
        like5: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;
