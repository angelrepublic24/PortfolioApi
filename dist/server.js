"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const db_1 = require("./config/db");
const routers_1 = require("./routers");
const cors_1 = require("./config/cors");
const cors_2 = __importDefault(require("cors"));
(0, db_1.connectDB)();
const app = (0, express_1.default)();
app.use((0, cors_2.default)(cors_1.corsConfig));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
// Declare routes
app.use('/api', routers_1.userRouter);
app.use('/api', routers_1.projectRouter);
app.use('/api', routers_1.experienceRouter);
exports.default = app;
//# sourceMappingURL=server.js.map