import { Request, Response } from "express";
declare const create: (req: Request, res: Response) => Promise<void>;
declare const getAll: (req: Request, res: Response) => Promise<void>;
declare const getAllAdmin: (req: Request, res: Response) => Promise<void>;
declare const toggleVisibility: (req: Request, res: Response) => Promise<void>;
declare const getById: (req: Request, res: Response) => Promise<void>;
declare const update: (req: Request, res: Response) => Promise<void>;
declare const remove: (req: Request, res: Response) => Promise<void>;
export { create, getAll, getAllAdmin, getById, update, remove, toggleVisibility };
