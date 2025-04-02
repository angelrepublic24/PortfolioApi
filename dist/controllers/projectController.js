"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.getImage = exports.upload = exports.remove = exports.update = exports.getById = exports.getAll = exports.create = void 0;
const Project_1 = __importDefault(require("../models/Project"));
const fs = __importStar(require("fs"));
const cloudinaryConfig_1 = __importDefault(require("../cloudinaryConfig"));
const create = async (req, res) => {
    try {
        const body = req.body;
        let langArray = [];
        if (typeof body.lang === "string") {
            langArray = body.lang.split(",").map((item) => item.trim());
        }
        else if (Array.isArray(body.lang)) {
            langArray = body.lang.flatMap((item) => typeof item === "string"
                ? item.split(",").map((lang) => lang.trim())
                : item);
        }
        const project = new Project_1.default({ ...body, user: req.user, lang: langArray });
        await project.save();
        res.status(200).json({
            ok: true,
            project: project,
            messsage: "Project saved successfully",
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message || "Internal server error",
        });
    }
};
exports.create = create;
const getAll = async (req, res) => {
    try {
        const projects = await Project_1.default.find().sort('-date -createdAt');
        res.status(200).json({
            projects,
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            error,
        });
    }
};
exports.getAll = getAll;
const getById = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await Project_1.default.findById(projectId);
        res.status(200).json({
            project,
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            error,
        });
    }
};
exports.getById = getById;
const update = async (req, res) => {
    try {
        const body = req.body;
        const projectId = req.params.id;
        const existinProject = await Project_1.default.findById(projectId);
        if (!existinProject) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        const updateFields = {};
        Object.keys(body).forEach((key) => {
            if (body[key] !== undefined && body[key] !== existinProject[key]) {
                updateFields[key] = body[key];
            }
        });
        if (Object.keys(updateFields).length === 0) {
            res.status(400).json({ message: "No changes detected" });
            return;
        }
        const project = await Project_1.default.findByIdAndUpdate(projectId, updateFields, {
            new: true,
        });
        res.status(200).json({
            ok: true,
            project,
        });
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};
exports.update = update;
const remove = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await Project_1.default.findById(projectId);
        if (!project) {
            res.status(404).json({ ok: false, msg: "Project not found" });
            return;
        }
        await Project_1.default.findByIdAndDelete(projectId);
        res.status(200).json({ ok: true, msg: "Project deleted" });
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};
exports.remove = remove;
const upload = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: "File not found" });
        }
        let fileName = req.file.originalname;
        let fileSplit = fileName.split(".");
        let mediaExt = fileSplit[1].toLowerCase();
        const validExt = ["png", "gif", "jpg", "jpeg"];
        if (!validExt.includes(mediaExt)) {
            fs.unlink(req.file.path, () => {
                res.status(400).json({
                    ok: false,
                    message: "The extension is not supported",
                });
            });
            return;
        }
        const result = await cloudinaryConfig_1.default.uploader.upload(req.file.path, {
            folder: "Portfolio",
            use_filename: true,
            unique_filename: true,
        });
        fs.unlinkSync(req.file.path);
        res.status(200).json({
            ok: true,
            // project,
            publicId: result.public_id,
            image: result.secure_url,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.upload = upload;
const deleteImage = async (req, res) => {
    try {
        const { publicId } = req.body; // Recibimos el publicId
        if (!publicId) {
            res.status(400).json({ message: "Public ID is required" });
            return;
        }
        const result = await cloudinaryConfig_1.default.uploader.destroy(publicId);
        console.log("✅ Respuesta de Cloudinary:", result);
        if (result.result !== "ok") {
            res.status(500).json({ message: "Failed to delete image in Cloudinary" });
            return;
        }
        res.status(200).json({ message: "Image deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteImage = deleteImage;
const getImage = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await Project_1.default.findById(projectId);
        if (!project || !project.image) {
            res.status(404).json({ ok: false, message: "Image not found" });
            return;
        }
        res.redirect(project.image);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving image", error: error.message });
    }
};
exports.getImage = getImage;
//# sourceMappingURL=projectController.js.map