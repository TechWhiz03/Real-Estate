import express from 'express';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js'
import listingRouter from './routes/listing.route.js'
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

const __dirname = path.resolve();
const app = express();
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(`MongoDB connected successfully`);
  })
  .catch((err) => {
    console.log(`MONGODB Connection Error: ${err}`);
  });


app.listen(process.env.PORT || 8000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});