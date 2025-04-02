"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRouter = exports.experienceRouter = exports.userRouter = void 0;
var user_router_1 = require("./user_router");
Object.defineProperty(exports, "userRouter", { enumerable: true, get: function () { return __importDefault(user_router_1).default; } });
var experience_route_1 = require("./experience_route");
Object.defineProperty(exports, "experienceRouter", { enumerable: true, get: function () { return __importDefault(experience_route_1).default; } });
var project_router_1 = require("./project_router");
Object.defineProperty(exports, "projectRouter", { enumerable: true, get: function () { return __importDefault(project_router_1).default; } });
//# sourceMappingURL=index.js.map