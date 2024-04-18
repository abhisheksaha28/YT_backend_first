import mongoose  from "mongoose";

import { DB_NAME } from "../constants.js";//db er naam da re aano 


//lets ake the connection..async-await use korte hoibo, r pura da code try-catch a wrap korte hoibo
const connectDB = async () => {
    try {
        //connection da re ekta variable er naam o dewa jay
        
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        //.connection.host => this indicates on which host we are getting connected
        //sob kisu , like production,dtabase,etc,etc, sob kisur alada alada server thake, toh bhule onno kunu host thika je connection establish na hoia jay erliga ai  jinis ta use kortasi
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);//for any uncaught error
    }
}

export default connectDB;
