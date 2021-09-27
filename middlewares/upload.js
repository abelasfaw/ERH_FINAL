const Admin = require("../models/admin.model");
const Student = require("../models/student.model");
// const BadRequestError = require("../utils/error");
// const catchAsync = require("../utils/catchAsync");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public");
    },
    filename: (req, file, cb) => {
        const fileExt = file.mimetype.split("/")[1];

        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`);
    },
});

const fileFilter = (req, file, cb) => {
    const imageFormats = /jpg|jpeg|png|pdf/;
    const fileExt = file.mimetype.split("/")[1];
    const checkValidImageFormat = imageFormats.test(fileExt);

    if (checkValidImageFormat === true) {
        cb(null, true);
    } else {
        cb(new BadRequestHandler("Invalid image input", 401));
    }
};

const upload = multer({ storage: storage,  fileFilter }).single(
    "file"
);

module.exports = upload;