import { Response,Request, NextFunction } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = (req: Request , res : Response , next : NextFunction)=>{
   const errors = validationResult(req);
   
   if(!errors.isEmpty()){
    return res.status(400).json({ errors : errors.array() })
   }
   console.log("ciao")
   next()
}

export const validateMyUserRequest = [
body("name").isString().notEmpty().withMessage("name must be a string"),
body("addressLine1").isString().notEmpty().withMessage("addressLine1 must be a string"),
body("country").isString().notEmpty().withMessage("country must be a string"),
body("city").isString().notEmpty().withMessage("city must be a string"),
handleValidationErrors  
]

export const validateMyRestaurantRequest = [
   body("restaurantName").isString().notEmpty().withMessage("restaurantName must be a string"),
   body("city").isString().notEmpty().withMessage("city must be a string"),
   body("country").isString().notEmpty().withMessage("country must be a string"),
   body("deliveryPrice").isFloat({min : 0}).withMessage("deliveryPrice must be a positive number"),
   body("estimatedDeliveryTime").isInt({min:0}).withMessage("estimatedDeliveryTime must be a positive integer"),
   body("cuisines").isArray().withMessage("cuisines must be an array").not().isEmpty().withMessage("cuisines cannot be empty"),
   body("menuItems").isArray().withMessage("menuItems must be an array"),
   body("menuItems.*.name").notEmpty().withMessage("menuItems.name must be a string"),
   body("menuItems.*.price").isFloat({min:0}).withMessage("menuItems.price must be a positive number"),
   handleValidationErrors
]
