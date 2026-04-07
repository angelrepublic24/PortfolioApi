"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsConfig = void 0;
const whiteList = [
    process.env.URL_FRONTEND,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
].filter(Boolean);
exports.corsConfig = {
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g. server-to-server, curl, mobile apps)
        if (!origin) {
            callback(null, true);
            return;
        }
        if (whiteList.includes(origin)) {
            callback(null, true);
        }
        else {
            console.error(`CORS Error: Origin ${origin} is not allowed.`);
            callback(new Error("CORS error"));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};
//# sourceMappingURL=cors.js.map