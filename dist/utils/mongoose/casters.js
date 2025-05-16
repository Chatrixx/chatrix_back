import mongoose from "mongoose";
export const MongoObjectId = (id) => new mongoose.Types.ObjectId(id);
