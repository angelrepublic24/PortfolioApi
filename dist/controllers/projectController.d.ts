import { Request, Response } from "express";
declare const create: (req: Request, res: Response) => Promise<void>;
declare const getAll: (req: Request, res: Response) => Promise<void>;
declare const getById: (req: Request, res: Response) => Promise<void>;
declare const update: (req: Request, res: Response) => Promise<void>;
declare const remove: (req: Request, res: Response) => Promise<void>;
declare const upload: (req: Request, res: Response) => Promise<void>;
declare const deleteImage: (req: Request, res: Response) => Promise<void>;
declare const getImage: (req: Request, res: Response) => Promise<void>;
export { create, getAll, getById, update, remove, upload, getImage, deleteImage };
