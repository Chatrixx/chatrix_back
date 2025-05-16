const allowedOrigins = [
    "http://localhost:3000",
    "https://chatrix-v1.vercel.app",
    "https://hkaratas.com",
];
export const corsOptions = {
    origin: (requestOrigin, callback) => {
        if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    exposedHeaders: ["Authorization"],
};
