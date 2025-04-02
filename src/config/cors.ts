import { CorsOptions } from "cors";

console.log("CORS Config - Process Args:", process.argv);

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const whiteList = [process.env.URL_FRONTEND];

    // Permite solicitudes sin 'origin' (como las de Render)
    if (!origin || whiteList.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS Error: Origin ${origin} is not allowed.`);
      callback(new Error("CORS error"));
    }
  },
  credentials: true, 
  optionsSuccessStatus: 200,
};
