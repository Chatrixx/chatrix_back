import { CorsOptions } from "cors";

// const allowedOrigins = [
//   "http://localhost:3000",
//   "https://chatrix-v1.vercel.app",
//   "https://chatrix-front-728855696411.europe-west1.run.app",
//   "https://hkaratas.com",
// ];

// export const corsOptions: CorsOptions = {
//   origin: (requestOrigin, callback) => {
//     if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
//   exposedHeaders: ["Authorization"],
// };

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow all origins by reflecting the request origin
    callback(null, origin || true);
  },
  credentials: true,
  exposedHeaders: ["Authorization"],
};
