import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()


// -------> CREATE ROUTES FOR PATHS
// for users to upload media files, we have to use the multer middleware here
router.route("/register").post(
    //use upload.field because her are multiple fields like dp ,avatar.....if only one field was there, then we mmay have used upload.arrray
    upload.fields([
        //fields accepts an array of field, below we will b writing all the objects to be ccepted here
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    registerUser
    )



//router for login
router.route("/login").post(loginUser)   

//now i have to give some routes for middlewsres, that will work only when the user is loggedin
//secured routes
//before running logout middleware, verification is to be done
router.route("/logout").post(verifyJWT,logoutUser)






export default router