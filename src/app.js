import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
/***** IMPORT OF MODULES DONE  ****/

const app = express();


/***********  LET'S DO ALL THE CONFIGURATIONS REQUIRED TO RUN THE APPLICATION  ***********/


app.use( cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

//jei data da aami nitasi uida re configure koroner liga
app.use(express.json({limit: "20kb"}));

//aibar amar je URL uida re o configure korte hoiobo
app.use(express.urlencoded({extended:true}))

//jodi ami amar njer server a kun media, like pdf,imge,etc  kunu kisu store kortam chai, uida ami public folder a store koira rakhi
//uuida re o configure kore hoy, static diya
app.use(express.static("public"))


//aibar cookoies ti re o configure koro
//cookir-parser er kaaj hoilo just cookies ti re securely store koron
app.use(cookieParser())

/***********  CONFIGURTION OF REQUIRED THINGS DONE  ************/



/**************** SETUP THE ROUTES ******************/
  

//********* Task-1 => Import Routes first

import userRouter from './routes/user.routes.js';


//********* Task-2 => Declare the Routes

//normally amra app.get() oi use kori,karon tokhon aamra same file aa oi route o lekhtaslam r same file a oi controller o lekhtaslam, but aidike korte partam na karon route r ontroller sob alada alada folder a
//aidike amrar aagee middleware use korte hoibo routes ti re call koroner liga, erliga app.use() kkortre lagbo
//app.use(path,router_name).....app.use( jakhusi_path_lekho-----sob_use_koron_ jaibo)

app.use( "/user",userRouter) //jokhon oi keu /user pat tat jaibo, userRouter ta activatte hoia jaibo, toh user.controller.js a giya ai userRouter er kaaj ta lekho








export { app }; //export default app;...both are same thing,just 2 ways to write