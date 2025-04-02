"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profile = exports.login = exports.create = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt = __importStar(require("bcrypt"));
const verifyToken_1 = require("../middlewares/verifyToken");
const create = async (req, res) => {
    try {
        const body = req.body;
        console.log(body);
        const { email } = body;
        const userExist = await User_1.default.findOne({ email });
        if (userExist) {
            const error = new Error('Email already exists');
            res.status(409).json({ error: error.message });
            return;
        }
        const user = new User_1.default(body);
        user.password = bcrypt.hashSync(body.password, 10);
        await user.save();
        res.status(200).send({
            ok: true,
            user
        });
        return;
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.create = create;
const login = async (req, res) => {
    try {
        const body = req.body;
        const user = await User_1.default.findOne({ email: body.email });
        if (!user)
            res.status(401).send({ msg: "email not found" });
        if (!bcrypt.compareSync(body.password, user.password)) {
            res.status(401).send({ msg: "passwords do not match" });
            return;
        }
        const token = (0, verifyToken_1.createToken)({ id: user._id });
        console.log(token);
        res.status(200).json({
            status: true,
            user,
            token,
            msg: 'User authenticated'
        });
        return;
    }
    catch (err) {
        res.status(500).json({ error: err.message });
        return;
    }
};
exports.login = login;
const profile = async (req, res) => {
    res.json(req.user);
};
exports.profile = profile;
//# sourceMappingURL=userController.js.map