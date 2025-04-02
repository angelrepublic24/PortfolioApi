import { Request, Response } from "express";
declare const create: (req: Request, res: Response) => Promise<void>;
declare const login: (req: Request, res: Response) => Promise<void>;
declare const profile: (req: Request, res: Response) => Promise<void>;
export { create, login, profile, };
