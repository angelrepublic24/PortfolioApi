import { CorsOptions } from "cors";

const whiteList = [
  process.env.URL_FRONTEND,
  process.env.URL_FRONTEND_WWW,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3010",
  "http://127.0.0.1:3010",
].filter(Boolean) as string[];

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS Error: Origin ${origin} is not allowed.`);
      callback(new Error("CORS error"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};