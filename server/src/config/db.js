import mongoose from "mongoose";

export async function connectDb(mongodbUrl) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongodbUrl, {
  family: 4
});
}
