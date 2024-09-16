import express from "express";
import cors from "cors";
import "dotenv/config";
import { Request, Response } from "express";
import mongoose from "mongoose";
import MyUserRoute from "./routes/MyUserRoute";
import { v2 as cloudinary } from "cloudinary";
import MyRestaurantRoute from "./routes/MyRestaurantRoute";
import RestaurantRoute from "./routes/RestaurantRoute";

const port = 7000;
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
  console.log("connected to mongodb");
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.json());
app.use(cors());

app.get("/server-check", (req: Request, res: Response) => {
  res.send({ msg: "server is up and running" });
});

app.use("/api/my/user", MyUserRoute);
app.use("/api/my/restaurant", MyRestaurantRoute); // typo fixed
app.use("/api/restaurant", RestaurantRoute);

app.listen(port, () => {
  console.log("listening on port: " + port);
});
