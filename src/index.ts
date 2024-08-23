import express from "express";
import cors from "cors";
import "dotenv/config";
import { Request,Response } from "express";
import mongoose from "mongoose";
import MyUserRoute from "./routes/MyUserRoute"

const port =7000
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(()=>{
    console.log("connected to mongodb")
})
const app = express();

app.use(express.json())
app.use(cors())


app.get("/server-check",(req:Request,res:Response)=>{
    res.send({msg :"server is up and running"})
})

app.use("/api/my/user",MyUserRoute)

app.listen(port,()=>{
    console.log("listening on port: "+port)
})