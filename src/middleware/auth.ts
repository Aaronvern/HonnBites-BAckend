import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { decode, JwtPayload } from "jsonwebtoken";
import User from "../models/user";

declare global {
  namespace Express {
    interface Request{
      userId : string ,
      auth0Id : string
    }
  }
}

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

const jwtParse = async (req: Request ,res: Response , next: NextFunction )=>{
  const { authorization } = req.headers;
  if(!authorization || !authorization.startsWith("Bearer ")){
    return res.sendStatus(404).json({
      msg: "user not authorised" 
    })
  }
  const token = authorization.split(" ")[1]
  try{
    const decodedToken = decode(token) as JwtPayload
    const auth0Id = decodedToken.sub

    const user = await User.findOne({auth0Id})

    if(!user){
      return res.status(401).json({
        msg:"unauthorised user access denied!"
      })
    }
    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();
    next();

  }catch(error){
    return res.status(401).json({
      msg : "server crash, access denied!"
    })
  }

}

export {jwtCheck, jwtParse}