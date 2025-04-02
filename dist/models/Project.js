"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const projectSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    lang: {
        type: [String],
    },
    url: {
        type: String,
    },
    image: {
        type: String,
    },
    user: {
        type: mongoose_1.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    date: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true
});
const Project = (0, mongoose_1.model)('Project', projectSchema);
exports.default = Project;
//# sourceMappingURL=Project.js.map