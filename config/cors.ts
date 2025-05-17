import { CorsOptions } from "cors";

const allowedOrigins = [
  "http://localhost:3000",
  "https://myfronturl",
  "https://hkaratas.com",
];

export const corsOptions: CorsOptions = {
  origin: (requestOrigin, callback) => {
    return (req: Request) => {
      const userAgent = req.headers.get("user-agent") || "";

      if (userAgent === "ManyChat") {
        // Allow regardless of origin
        callback(null, true);
      } else if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    };
  },
  credentials: true,
  exposedHeaders: ["Authorization"],
};
