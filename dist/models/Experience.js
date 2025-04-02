"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const experienceSchema = new mongoose_1.Schema({
    company: {
        type: String,
        required: true,
    },
    position: {
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
    user: {
        type: mongoose_1.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    url: {
        type: String,
    },
    date: {
        type: [mongoose_1.Schema.Types.Mixed],
        required: true,
        validate: {
            validator: function (value) {
                return (Array.isArray(value) &&
                    value.length === 2 &&
                    typeof value[0] === "number" &&
                    (typeof value[1] === "number" || typeof value[1] === "string") &&
                    value[0] <= (typeof value[1] === "number" ? value[1] : new Date().getFullYear()));
            },
            message: "The field must be an array with 2 valid values: [startYear (number), endYear (number|string)]"
        }
    }
}, {
    timestamps: true
});
const Experience = (0, mongoose_1.model)('Experience', experienceSchema);
exports.default = Experience;
//# sourceMappingURL=Experience.js.map