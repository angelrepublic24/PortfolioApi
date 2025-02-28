import express from 'express';
import { create, getAll, remove, update } from '../controllers/experienceController';
import { validateExperienceRegister, validateProjectRegister } from '../helpers/validation';
import { validationResult } from 'express-validator';
import multer from 'multer'
import { verifyToken } from '../middlewares/verifyToken';


const experienceRouter = express.Router();

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}
experienceRouter.post('/experience', verifyToken, validateExperienceRegister, handleValidationErrors, create)
experienceRouter.get('/experience', getAll)
experienceRouter.patch('/experience/:id', verifyToken, update)
experienceRouter.delete('/experience/:id', verifyToken, remove)

export default experienceRouter