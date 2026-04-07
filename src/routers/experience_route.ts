import express from 'express';
import { create, getAll, getAllAdmin, getById, remove, reorder, toggleVisibility, update } from '../controllers/experienceController';
import { validateExperienceRegister } from '../helpers/validation';
import { validationResult } from 'express-validator';
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
experienceRouter.get('/admin/experience', verifyToken, getAllAdmin)
experienceRouter.patch('/experience/reorder/all', verifyToken, reorder)
experienceRouter.get('/experience/:id', getById)
experienceRouter.patch('/experience/:id', verifyToken, update)
experienceRouter.patch('/experience/:id/visibility', verifyToken, toggleVisibility)
experienceRouter.delete('/experience/:id', verifyToken, remove)

export default experienceRouter
