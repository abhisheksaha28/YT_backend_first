import dotenv from "dotenv";
import connectDB from "./db/index.js";

//dotenv da re aibar configure korte hoibo
dotenv.config({
    path: './env'
})

//just connecting the databse
connectDB()