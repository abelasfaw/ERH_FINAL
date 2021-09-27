const mongoose = require("mongoose")

const Schema = mongoose.Schema;
require("mongoose-type-email");
require("mongoose-type-phone");


require('mongoose-type-email');

const approverSchema = new Schema ({

    name: {
        type: String,
    },
    username: {
        type: String,
        unique: true,
    },
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Admin",
    },
    departmentId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Department",
    },
    profilePicture: {
        type: String,
        default: "",
    },
    email: mongoose.SchemaTypes.Email,
    academiclevel: {
        type: String,
    },
    phone: {
        type: mongoose.SchemaTypes.Email,
        defaultRegion: "ET",
    },
    year: {
        type: Date,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
    },
    changeProfile: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        default: "approver",
        enum: ["admin", "approver", "user", "superadmin"],
        trim: true,
    },
},
{
    timestamps: true,
}
);

const Approver = mongoose.model("Approver", approverSchema);
module.exports = Approver;



