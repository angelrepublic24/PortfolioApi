import express from 'express';
import { create, login, profile } from '../controllers/userController';
import { validateLogin, validateUserRegister } from '../helpers/validation';
import { validationResult } from 'express-validator';
import { verifyToken } from '../middlewares/verifyToken';


const userRouter = express.Router();

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}


userRouter.post('/auth/register', validateUserRegister, handleValidationErrors, create)
userRouter.post('/auth/login', validateLogin, handleValidationErrors, login)
userRouter.get('/auth/profile', verifyToken, profile)



export default userRouter