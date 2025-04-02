"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.getAll = exports.create = void 0;
const Experience_1 = __importDefault(require("../models/Experience"));
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
        const dateArray = Array.isArray(body.date)
            ? body.date.map((year) => (year === "Present" ? "Present" : Number(year)))
            : body.date.split(",").map((year) => year.trim() === "Present" ? "Present" : Number(year.trim()));
        // Verifica que el primer valor sea un número y el segundo sea un número o "Present"
        if (dateArray.length !== 2 ||
            typeof dateArray[0] !== "number" ||
            (typeof dateArray[1] !== "number" && dateArray[1] !== "Present") ||
            (typeof dateArray[1] === "number" && dateArray[0] > dateArray[1])) {
            res.status(400).json({
                ok: false,
                message: "Invalid date format. Please provide a valid array with [startYear, endYear] where endYear can be a number or 'Present'.",
            });
            return;
        }
        const experience = new Experience_1.default({ ...body, user: req.user, lang: langArray, date: dateArray });
        await experience.save();
        res.status(200).json({
            ok: true,
            experience: experience,
            message: "Experience saved successfully",
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error,
            message: error.message
        });
    }
};
exports.create = create;
const getAll = async (req, res) => {
    try {
        const experience = await Experience_1.default.find().sort('-date');
        res.status(200).json({
            experience,
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            error,
            message: error.message || "Internal server error",
        });
    }
};
exports.getAll = getAll;
const getById = async (req, res) => {
    try {
        const experienceId = req.params.id;
        const experience = await Experience_1.default.findById(experienceId);
        res.status(200).json({
            experience,
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            error,
        });
    }
};
const update = async (req, res) => {
    try {
        const body = req.body;
        const experienceId = req.params.id;
        const existingExperience = await Experience_1.default.findById(experienceId);
        if (!existingExperience) {
            res.status(404).json({ message: "Experience not found" });
            return;
        }
        const updateFields = {};
        // Procesar lang
        if (body.lang !== undefined) {
            let langArray = [];
            if (typeof body.lang === "string") {
                langArray = body.lang.split(",").map((item) => item.trim());
            }
            else if (Array.isArray(body.lang)) {
                langArray = body.lang.flatMap((item) => typeof item === "string"
                    ? item.split(",").map((lang) => lang.trim())
                    : item);
            }
            updateFields.lang = langArray;
        }
        // Procesar date
        if (body.date !== undefined) {
            const dateArray = Array.isArray(body.date)
                ? body.date.map((year) => (year === "Present" ? "Present" : Number(year)))
                : body.date.split(",").map((year) => year.trim() === "Present" ? "Present" : Number(year.trim()));
            // Validar formato correcto
            if (dateArray.length !== 2 ||
                typeof dateArray[0] !== "number" ||
                (typeof dateArray[1] !== "number" && dateArray[1] !== "Present") ||
                (typeof dateArray[1] === "number" && dateArray[0] > dateArray[1])) {
                res.status(400).json({
                    ok: false,
                    message: "Invalid date format. Please provide a valid array with [startYear, endYear] where endYear can be a number or 'Present'.",
                });
                return;
            }
            updateFields.date = dateArray;
        }
        // Procesar otros campos
        Object.keys(body).forEach((key) => {
            if (body[key] !== undefined &&
                key !== "lang" &&
                key !== "date" &&
                body[key] !== existingExperience[key]) {
                updateFields[key] = body[key];
            }
        });
        if (Object.keys(updateFields).length === 0) {
            res.status(400).json({ message: "No changes detected" });
            return;
        }
        const updatedExperience = await Experience_1.default.findByIdAndUpdate(experienceId, updateFields, {
            new: true,
        });
        res.status(200).json({
            ok: true,
            experience: updatedExperience,
            message: "Experience updated successfully",
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
        const experienceId = req.params.id;
        const experience = await Experience_1.default.findById(experienceId);
        if (!experience) {
            res.status(404).json({ ok: false, msg: "Project not found" });
            return;
        }
        await Experience_1.default.findByIdAndDelete(experienceId);
        res.status(200).json({ ok: true, msg: "Project deleted" });
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};
exports.remove = remove;
//# sourceMappingURL=experienceController.js.map