import mongoose from "mongoose";
export const MongoObjectId = (id: string) => new mongoose.Types.ObjectId(id);
