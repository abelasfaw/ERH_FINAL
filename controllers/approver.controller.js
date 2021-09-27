const User = require("../models/user.model");
const Approver = require("../models/approver.model");
const Admin = require("../models/admin.model");
const Upload = require("../models/upload.model");

exports.getUpload = async (req, res) => {
    const upload = await Upload.find({});
    res.json({ upload });
};

exports.getHistory = async (req, res) => {
    const declinedPost = await Upload.find({ state: "declined" });
    const approvedPost = await Upload.find({ state: "post" });
    res.json({ declinedPost, approvedPost });
};
