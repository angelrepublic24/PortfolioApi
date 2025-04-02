"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const validation_1 = require("../helpers/validation");
const express_validator_1 = require("express-validator");
const verifyToken_1 = require("../middlewares/verifyToken");
const userRouter = express_1.default.Router();
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
userRouter.post('/auth/register', validation_1.validateUserRegister, handleValidationErrors, userController_1.create);
userRouter.post('/auth/login', validation_1.validateLogin, handleValidationErrors, userController_1.login);
userRouter.get('/auth/profile', verifyToken_1.verifyToken, userController_1.profile);
exports.default = userRouter;
//# sourceMappingURL=user_router.js.map