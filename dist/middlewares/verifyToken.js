"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const verifyToken = async (req, res, next) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        res.status(403).send({ msg: "The header is required" });
        return;
    }
    const [, token] = bearer.split(" ");
    if (!token) {
        const error = new Error('The token is required');
        res.status(401).json({
            error: error.message
        });
    }
    try {
        const result = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof result === 'object' && result.id) {
            const user = await User_1.default.findById(result.id);
            if (!user) {
                const error = new Error('User not found');
                res.status(401).json({ error: error.message });
                return;
            }
            req.user = user;
            next();
        }
    }
    catch (err) {
        res.status(500).json({
            msg: 'The token is invalid',
            error: err
        });
    }
};
exports.verifyToken = verifyToken;
const createToken = (payload) => {
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '120d' });
    return token;
};
exports.createToken = createToken;
//# sourceMappingURL=verifyToken.js.map