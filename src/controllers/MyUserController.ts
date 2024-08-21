import { Request, Response } from "express";
import User from "../models/user";

const createCurrentUser = async(req: Request , res: Response)=>{
  //check existing user 
  //create user
  //return user object to calling client
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

export default {
  createCurrentUser,
}