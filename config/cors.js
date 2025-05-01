const allowedOrigins = [
  "http://localhost:3000",
  "https://chatrix-v1.vercel.app",
  "https://hkaratas.com",
];

export const corsOptions = {
  origin: function (origin, callback) {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /^https:\/\/chatrix-v1-.*\.vercel\.app$/.test(origin) // allow preview branches
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // allow cookies or auth headers
  exposedHeaders: ["Authorization"], // allow frontend access to this header
};
