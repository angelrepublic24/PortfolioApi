import { Request, Response } from "express";
import Project from "../models/Project";
import * as fs from "fs";
import path from "path";
import cloudinary from "../cloudinaryConfig";

const create = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    let langArray = [];
    if (typeof body.lang === "string") {
      langArray = body.lang.split(",").map((item) => item.trim());
    } else if (Array.isArray(body.lang)) {
      langArray = body.lang.flatMap((item) =>
        typeof item === "string"
          ? item.split(",").map((lang) => lang.trim())
          : item
      );
    }

    const project = new Project({ ...body, user: req.user, lang: langArray });
    await project.save();
    res.status(200).json({
      ok: true,
      project: project,
      messsage: "Project saved successfully",
    });
    return;
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message || "Internal server error",
    });
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort('-date -createdAt');
    res.status(200).json({
      projects,
    });
    return;
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findById(projectId);
    res.status(200).json({
      project,
    });
    return;
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const projectId = req.params.id;

    const existinProject = await Project.findById(projectId);
    if (!existinProject) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const updateFields: Partial<typeof existinProject> = {};
    Object.keys(body).forEach((key) => {
      if (body[key] !== undefined && body[key] !== existinProject[key]) {
        updateFields[key] = body[key];
      }
    });

    if (Object.keys(updateFields).length === 0) {
      res.status(400).json({ message: "No changes detected" });
      return;
    }
    const project = await Project.findByIdAndUpdate(projectId, updateFields, {
      new: true,
    });
    res.status(200).json({
      ok: true,
      project,
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404).json({ ok: false, msg: "Project not found" });
      return;
    }
    await Project.findByIdAndDelete(projectId);
    res.status(200).json({ ok: true, msg: "Project deleted" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const upload = async (req: Request, res: Response) => {
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
    const result = await cloudinary.uploader.upload(req.file.path, {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteImage = async (req: Request, res: Response) => {
  try {
    const { publicId } = req.body; // Recibimos el publicId

    if (!publicId) {
      res.status(400).json({ message: "Public ID is required" });
      return 
    }

    const result = await cloudinary.uploader.destroy(publicId);

    console.log("✅ Respuesta de Cloudinary:", result);

    if (result.result !== "ok") {
      res.status(500).json({ message: "Failed to delete image in Cloudinary" });
      return 
    }

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getImage = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);

    if (!project || !project.image) {
      res.status(404).json({ ok: false, message: "Image not found" });
      return;
    }

    res.redirect(project.image)
  } catch (error) {
    res.status(500).json({ message: "Error retrieving image", error: error.message });

  }
};
export { create, getAll, getById, update, remove, upload, getImage, deleteImage };
