const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            default: "user",
            enum: ["admin", "approver", "user", "superadmin"],
        },
        departmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
        },

        instituteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },

        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
        },

        approverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Approver",
        },
        profileCreated: {
            type: Boolean,
            default: false,
        },
        changeProfile: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            default: null,
        },
        externalUser: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});
userSchema.set("toJSON", {
    transform: function (doc, ret, options) {
        delete ret.password;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
    },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
