import express from 'express';
import dotenv from "dotenv";
import mongoose from 'mongoose';

import userRouter from './routes/user.route.js'

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log(`MongoDB connected successfully`);
  })
  .catch((err) => {
    console.log(`MONGODB Connection Error: ${err}`);
  });

app.use("/api/user",userRouter);
  
app.listen(process.env.PORT || 8000, () => {
      console.log(`Server running on port ${process.env.PORT}`);
});