import express from "express";
import { get, update } from "../controllers/siteContentController";
import { verifyToken } from "../middlewares/verifyToken";

const siteContentRouter = express.Router();

siteContentRouter.get("/site-content", get);
siteContentRouter.patch("/site-content", verifyToken, update);

export default siteContentRouter;
