// const allowedOrigins = [
//   "http://localhost:3000",
//   "https://chatrix-v1.vercel.app",
//   "https://hkaratas.com",
// ];

// export const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)
//     ) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true, // allow cookies or auth headers
//   exposedHeaders: ["Authorization"], // allow frontend access to this header
// };

export const corsOptions = {
  origin: (origin, callback) => callback(null, origin || "*"),
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
  exposedHeaders: ["Authorization"],
};
