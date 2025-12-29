// getting-started.js
import mongoose from "mongoose"
import dotenv from 'dotenv'

dotenv.config({ path: '' });

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

export default main;
