import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}
/**
 * Cached connection for MongoDB.
 */
if (!global.mongoose) {
    global.mongoose = {};
}
const cached = global.mongoose;
async function dbConnect() {
    if (cached.connection) {
        return cached.connection;
    }
    if (!cached.Promise) {
        cached.Promise = mongoose
            .connect(MONGODB_URI)
            .then((mongoose) => {
            return mongoose;
        });
    }
    cached.connection = await cached.Promise;
    return cached.connection;
}
export default dbConnect;
