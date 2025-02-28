import express from 'express';
import { create, deleteImage, getAll, getById, remove, update, upload } from '../controllers/projectController';
import { validateProjectRegister } from '../helpers/validation';
import { validationResult } from 'express-validator';
import multer from 'multer'
import { verifyToken } from '../middlewares/verifyToken';


const projectRouter = express.Router();

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (remove, file, cb) => {
        cb(null, "project" + Date.now()+"-"+file.originalname)
    }
})
const uploads = multer({storage})
projectRouter.post('/project', verifyToken, validateProjectRegister, handleValidationErrors, create)
projectRouter.get('/projects', getAll)
projectRouter.get('/project/:id', getById)
projectRouter.patch('/project/:id', verifyToken, update)
projectRouter.delete('/project/:id', verifyToken, remove)
projectRouter.post('/upload', verifyToken, uploads.single("file") , upload)
projectRouter.delete("/delete-image", verifyToken, deleteImage)

export default projectRouter