import {body} from 'express-validator';

const validateUserRegister = [
    body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
    body("lName")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters long"),
  body("email")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
]

const validateLogin = [
  body("email")
  .isEmail()
  .withMessage("Email is required"),
  body("password")
  .notEmpty()
  .withMessage("Password is required"),
]


// Project
const validateProjectRegister = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 2 })
    .withMessage("Description must be at least 2 characters long"),

  body("lang")
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

  body("url")
    .optional() // No es estrictamente requerido
    .isURL()
    .withMessage("The URL must be valid"),

  body("image")
    .optional()
    .isString()
    .withMessage("The image must be a valid string"),

  // body("user")
  //   .notEmpty()
  //   .withMessage("User ID is required")
  //   .isMongoId()
  //   .withMessage("Invalid User ID"),

  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isNumeric()
    .withMessage("Date must be an array with two values [start, end]"),
];

// Experience
const validateExperienceRegister = [
  body("company")
    .notEmpty()
    .withMessage("Company is required")
    .isLength({ min: 2 })
    .withMessage("Company must be at least 2 characters long"),

    body("position")
    .notEmpty()
    .withMessage("Position is required")
    .isLength({ min: 2 })
    .withMessage("Position must be at least 2 characters long"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 2 })
    .withMessage("Company must be at least 2 characters long"),

  body("lang")
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

  body("url")
    .optional()
    .isURL()
    .withMessage("The URL must be valid"),

    body("date")
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
      if (
        typeof value[1] !== "number" &&
        value[1] !== "Present"
      ) {
        throw new Error("End year must be a number or 'Present'");
      }
      if (typeof value[1] === "number" && value[0] > value[1]) {
        throw new Error("Start year cannot be greater than end year");
      }
      return true;
    }),
];

export {
    validateUserRegister,
    validateLogin,
    validateProjectRegister,
    validateExperienceRegister
}