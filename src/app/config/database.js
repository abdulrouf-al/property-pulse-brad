import mongoose from "mongoose";
let connected = false;
const connectDb = async () => {
  mongoose.set("strictQuery", true);

  if (connected) {
    console.log("MongoDb is already connected");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    connected = true;
    console.log("MongoDB connected..");
  } catch (err) {
    console.log(err);
  }
};
export default connectDb;
