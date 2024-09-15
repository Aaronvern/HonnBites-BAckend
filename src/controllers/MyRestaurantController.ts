import { Request, Response } from "express";
import Restaurant from "../models/restaurant";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

const getMyRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({
      user: req.userId,
    });

    if (!restaurant) {
      return res.status(404).json({
        msg: "restaurant not found",
      });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    console.log(" error in MyRestaurantController::getMyRestaurant", error);
    res.status(500).json({
      msg: "error fetching restaurant",
    });
  }
};

const createMyRestaurant = async (req: Request, res: Response) => {
  try {
    const existingRestaurant = await Restaurant.findOne({
      user: req.userId,
    });
    if (existingRestaurant) {
      return res.status(409).json({
        msg: "restaurant already exists",
      });
    }

    const image = req.file as Express.Multer.File;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;

    //uploading image to cloudinary
    const uploadRespose = await cloudinary.uploader.upload(dataURI);

    const restaurant = new Restaurant(req.body);
    restaurant.imageUrl = uploadRespose.url;
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.lastUpdated = new Date();
    await restaurant.save();

    res.status(201).send(restaurant);
  } catch (error) {
    console.log("MyRestaurantController::", error);
    res.status(500).json({
      msg: "something went wrong",
    });
  }
};

export default {
  createMyRestaurant,
  getMyRestaurant,
};
