"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const experienceController_1 = require("../controllers/experienceController");
const validation_1 = require("../helpers/validation");
const express_validator_1 = require("express-validator");
const verifyToken_1 = require("../middlewares/verifyToken");
const experienceRouter = express_1.default.Router();
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
experienceRouter.post('/experience', verifyToken_1.verifyToken, validation_1.validateExperienceRegister, handleValidationErrors, experienceController_1.create);
experienceRouter.get('/experience', experienceController_1.getAll);
experienceRouter.patch('/experience/:id', verifyToken_1.verifyToken, experienceController_1.update);
experienceRouter.delete('/experience/:id', verifyToken_1.verifyToken, experienceController_1.remove);
exports.default = experienceRouter;
//# sourceMappingURL=experience_route.js.map