import { Request, Response } from "express";
import User from "../models/user";

const createCurrentUser = async(req: Request , res: Response)=>{
  try{
    const { auth0Id }= req.body;
    const existingUser = await User.findOne({
      auth0Id
    })

    if(existingUser){
      return res.status(200).send()
    }
    const newUser = new User(req.body)
    await newUser.save()

    res.status(201).json(newUser.toObject())

  }catch(error){
    console.log("MyUserController::createCurrentUser",error)
    res.status(500).json({
      msg:"error when creating user"
    })
  }
}


const updateCurrentUser = async (req: Request , res : Response)=>{
  try{
    const {name , addressLine1 ,country , city } = req.body
    const user = await User.findById(req.userId)

    if (!user){
      return res.status(404).json({
        msg : "user not found"
      })
    }

    user.name = name;
    user.addressLine1 = addressLine1; 
    user.country = country ;
    user.city = city ;

    await user.save()

    res.send(user)

  }catch(error){
    console.log(" error while updating user info MyUserController.ts",error)
    res.status(404).json({
      msg:"couldnt update user!"
    })
  }
}


export default {
  createCurrentUser,
}