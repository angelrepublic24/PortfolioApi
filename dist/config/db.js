"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const colors_1 = __importDefault(require("colors"));
const connectDB = async () => {
    try {
        const { connection } = await mongoose_1.default.connect(process.env.DB_URI);
        const url = `${connection.host}:${connection.port}`;
        console.log(colors_1.default.cyan("Database connection established at " + url));
    }
    catch (e) {
        console.log(colors_1.default.bgRed.white(e));
        return e;
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map