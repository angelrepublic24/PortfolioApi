"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        required: true,
        type: String,
        trim: true,
    },
    lName: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        type: String,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        required: true,
        type: String,
        trim: true,
    },
    description: {
        type: String,
        default: ""
    }
});
userSchema.methods.toJSON = function () {
    let users = this;
    let userObject = users.toObject();
    delete userObject.password;
    return userObject;
};
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map