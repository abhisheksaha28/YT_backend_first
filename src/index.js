import dotenv from "dotenv";
import connectDB from "./db/index.js";

/***** IMPORT OF MODULES DONE  ****/

//dotenv da re aibar configure korte hoibo
dotenv.config({
    path: './env'
})

 
/**************** CONNECT THEE DATABASE TO OUR APLLICATION ******************/


//just connecting the databse

//asynchronous function ida, amra db/index.js a idar code leksilam
//jehetu async func ida, ida sobsomoy ekta promise return korbo
connectDB()
.then( ()=>{
    //the er moddhe amra app erjei code ta leksi,uida return hoibo
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at port: ${process.env.PORT}`);
    })
})
.catch( (err)=>{
    console.log("MongoDb connetion failed",err);
})

/***************** DATABASE CONNECTION IS ESTABLISHED ****************/