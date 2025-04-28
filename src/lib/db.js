import mongoose from "mongoose";

const mongouri = process.env.mongouri;

if (!mongouri) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

async function dbConnect() {
await mongoose.connect(mongouri)
.then(()=>console.log("Mongodb is connected"));
}

export default dbConnect;
