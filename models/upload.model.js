const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const uploadSchema = new Schema(
    {
        name: {
            type: String,
        },

        postname: {
            type: String,
        },
        file: {
            type: String,
        },
        title: {
            type: String,
        },
        description: {
            type: String,
        },

        department: {
            type: String,
        },

        under: {
            type: String,
        },
        academiclevel: {
            type: String,
        },
        date: {
            type: Date,
            default: Date.now(),
        },
        status: {
            type: Number,
            default: 100,
        },
        state: {
            type: String,
            default: "upload",
        },
        tag: {
            type: String,
        },
        uploader: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
        },
        institute: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },
    },
    {
        timestamps: true,
    }
);

const Upload = mongoose.model("Upload", uploadSchema);
module.exports = Upload;
