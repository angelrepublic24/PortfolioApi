"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsConfig = void 0;
exports.corsConfig = {
    origin: function (origin, callback) {
        const whiteList = [process.env.URL_FRONTEND];
        if (process.argv[2] === '--api') {
            whiteList.push(undefined);
        }
        if (whiteList.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Cors error'));
        }
    }
};
//# sourceMappingURL=cors.js.map