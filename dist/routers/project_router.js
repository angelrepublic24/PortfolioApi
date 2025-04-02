"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_1 = require("../controllers/projectController");
const validation_1 = require("../helpers/validation");
const express_validator_1 = require("express-validator");
const multer_1 = __importDefault(require("multer"));
const verifyToken_1 = require("../middlewares/verifyToken");
const projectRouter = express_1.default.Router();
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (remove, file, cb) => {
        cb(null, "project" + Date.now() + "-" + file.originalname);
    }
});
const uploads = (0, multer_1.default)({ storage });
projectRouter.post('/project', verifyToken_1.verifyToken, validation_1.validateProjectRegister, handleValidationErrors, projectController_1.create);
projectRouter.get('/projects', projectController_1.getAll);
projectRouter.get('/project/:id', projectController_1.getById);
projectRouter.patch('/project/:id', verifyToken_1.verifyToken, projectController_1.update);
projectRouter.delete('/project/:id', verifyToken_1.verifyToken, projectController_1.remove);
projectRouter.post('/upload', verifyToken_1.verifyToken, uploads.single("file"), projectController_1.upload);
projectRouter.delete("/delete-image", verifyToken_1.verifyToken, projectController_1.deleteImage);
exports.default = projectRouter;
//# sourceMappingURL=project_router.js.map