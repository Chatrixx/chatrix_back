/* eslint-disable no-var */
import { Mongoose } from "mongoose";
declare global {
  var mongoose: (Partial<Mongoose> & { connection: any }) | undefined;
}
export {};
