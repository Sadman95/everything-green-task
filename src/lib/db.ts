import config from "config";
import mongoose from "mongoose"

export const connectDB = async () : Promise<void> => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(config.db.uri as string)
}