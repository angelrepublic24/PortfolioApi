import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { IUser } from '../models/User';
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
declare const verifyToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const createToken: (payload: JwtPayload) => string;
export { createToken, verifyToken };
