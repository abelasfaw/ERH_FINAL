const mongoose = require("mongoose");

const Schema = mongoose.Schema;

require("mongoose-type-email");
require("mongoose-type-phone");

const AdminSchema = new Schema(
    {
        name: {
            type: String,
        },
        username: {
            type: String,
        },
        profilePicture: {
            type: String,
            default: "",
        },
        address: {
            type: String,
        },
        phone: {
            type: mongoose.SchemaTypes.Phone,
            defaultRegion: "ET",
        },
        email: mongoose.SchemaTypes.Email,
        under: {
            type: String,
        },
        date: {
            type: Date,
            default: Date.now(),
        },
        changeProfile: {
            type: Boolean,
            default: true,
        },
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
        },
        students: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "Student",
            },
        ],
        departments: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "Department",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;
