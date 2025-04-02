"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateExperienceRegister = exports.validateProjectRegister = exports.validateLogin = exports.validateUserRegister = void 0;
const express_validator_1 = require("express-validator");
const validateUserRegister = [
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters long"),
    (0, express_validator_1.body)("lName")
        .notEmpty()
        .withMessage("Last name is required")
        .isLength({ min: 2 })
        .withMessage("Last name must be at least 2 characters long"),
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Invalid email format"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];
exports.validateUserRegister = validateUserRegister;
const validateLogin = [
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Email is required"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required"),
];
exports.validateLogin = validateLogin;
// Project
const validateProjectRegister = [
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters long"),
    (0, express_validator_1.body)("description")
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ min: 2 })
        .withMessage("Description must be at least 2 characters long"),
    (0, express_validator_1.body)("lang")
        .notEmpty()
        .withMessage("Languages are required")
        .custom((value) => {
        if (typeof value === "string") {
            return value.split(",").map((item) => item.trim()).length > 0;
        }
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        throw new Error("Languages must be an array of strings");
    }),
    (0, express_validator_1.body)("url")
        .optional() // No es estrictamente requerido
        .isURL()
        .withMessage("The URL must be valid"),
    (0, express_validator_1.body)("image")
        .optional()
        .isString()
        .withMessage("The image must be a valid string"),
    // body("user")
    //   .notEmpty()
    //   .withMessage("User ID is required")
    //   .isMongoId()
    //   .withMessage("Invalid User ID"),
    (0, express_validator_1.body)("date")
        .notEmpty()
        .withMessage("Date is required")
        .isNumeric()
        .withMessage("Date must be an array with two values [start, end]"),
];
exports.validateProjectRegister = validateProjectRegister;
// Experience
const validateExperienceRegister = [
    (0, express_validator_1.body)("company")
        .notEmpty()
        .withMessage("Company is required")
        .isLength({ min: 2 })
        .withMessage("Company must be at least 2 characters long"),
    (0, express_validator_1.body)("position")
        .notEmpty()
        .withMessage("Position is required")
        .isLength({ min: 2 })
        .withMessage("Position must be at least 2 characters long"),
    (0, express_validator_1.body)("description")
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ min: 2 })
        .withMessage("Company must be at least 2 characters long"),
    (0, express_validator_1.body)("lang")
        .notEmpty()
        .withMessage("Languages are required")
        .custom((value) => {
        if (typeof value === "string") {
            return value.split(",").map((item) => item.trim()).length > 0;
        }
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        throw new Error("Languages must be an array of strings");
    }),
    (0, express_validator_1.body)("url")
        .optional()
        .isURL()
        .withMessage("The URL must be valid"),
    (0, express_validator_1.body)("date")
        .notEmpty()
        .withMessage("Date is required")
        .custom((value) => {
        if (!Array.isArray(value)) {
            throw new Error("Date must be an array with two values [start, end]");
        }
        if (value.length !== 2) {
            throw new Error("Date must contain exactly two values [start, end]");
        }
        if (typeof value[0] !== "number" || isNaN(value[0])) {
            throw new Error("Start year must be a valid number");
        }
        if (typeof value[1] !== "number" &&
            value[1] !== "Present") {
            throw new Error("End year must be a number or 'Present'");
        }
        if (typeof value[1] === "number" && value[0] > value[1]) {
            throw new Error("Start year cannot be greater than end year");
        }
        return true;
    }),
];
exports.validateExperienceRegister = validateExperienceRegister;
//# sourceMappingURL=validation.js.map