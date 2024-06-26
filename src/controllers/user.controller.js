//for error correction and detection
import { ApiError } from "../utils/ApiError.js";
//import the asynchandler for handling async functions
import { asyncHandler } from "../utils/asyncHandler.js";
//impot the users to check whether they already exist or not
import { User } from "../models/user.model.js";
//imprt the upoad cloudinay, to upload files
import {  uploadOnCloudinary } from "../utils/cloudinary.js";
//api response also to be exported
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";



/*********** TOKEN GENERATION ********/
// ai token generation da bar bar kkorte lage, so better idaa re ekta alada function code keikkha ai, erore jokhon oi lagbo ida re use koiea lamu, log dorkar porlr export o koira lamu
//aidik asycHndler er dorkar nai, just basicc async func use korle oi hobo
const generateAccessAndRefreshTokens = async(userId) => {
    //userId pass koramu, bsically jeida amar login criteria
    //try-catch apply kira deikkha lamu, kunu error toh paitasina ki na
    try {
        const user = await User.findById(userId)
        //take the tokens from the user schma
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        
        //refresh token shoukd be stored in db as well as this is given to both user and db , no need storing the acces oken, it will be with the user only
        user.refreshToken = refreshToken
        //while aving , the mongoode schema is kicked in, ssoit means that it will ask for passwoed as well, but we dont have pass word, so use validatebeforesave as falsse
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}
    } catch (error) {
        //server side issue
        throw new ApiError(500,"Somethin went wrong, while generating the tokens")
    }
}
/*********** TOKEN GENERATION COMPLTED********/
 


/*********** LET'S MAKE A CONTROLLER FOR USER REGISRATION ********/
const registerUser = asyncHandler( async(req,res) => {
    /** Just to check whether ruuninng or not ***/
    // res.status(200).json({
    //     message : "ok"
    // })

    //**** List our serials, what wee have to do for user rgistrations, check all  ***/
         //STEPS :-
              //1. get user details from frontend
              //2. validation - no field be empty
              // 3.check if user already exists: username, email
              //4. check for images, check for avatar
              //5. if any img,upload them to cloudinary, avatar
              //6. create user object - create entry in db
              //7. remove password and refresh token field from response( bec. they are stored protected in dB and only available to admin)
              //8. check whether  user created or not
              //9. if created , return res

    // ==> Start coding 

    //step-1
    //extract the req from body and destructure them
    // req.body = the req getting from user
    // const user_detail ...so this field from the body is to be extrcted from the user, s e have seen , not all thee inputs from the user is to be extracted during registration
    //cons { multiple_fields_canBePutHere}
    const { fullName , username , email ,  password} = req.body      
    //console.log("email : ",email) 
    
    //step-2
    //vaidate the users, by checking whether any field is empty or not
    
    /* CHECK LINE BY LINE EACH FIELD
    if(fullName === ""){
        //check o the APIError.js file that what fields are send 
        throw new ApiError( 400 , "This field is required")
    }

    if(email === ""){
           
        throw new ApiError( 400 , "This field is required")
    }
    if(password === ""){
           
        throw new ApiError( 400 , "This field is required")
    }
    if(username === ""){
           
        throw new ApiError( 400 , "This field is required")
    }
    */

    //we can check all the fields at once by making the if condition an array
    //in the if loop, pass an array as condition
    //for that purpose we will use the .some() func, this func takes argument and works on a given set of conditions
    //[set_of_conditions].some( callback_func)     ------>it checks the element from the array and checks atleast if any one element passes the condition (written in callback) and if passes gives the return(which is also deended upon callback func)
    //trim()  -->removes leading and trailing whitespaces
    //?. is the optional chaining
    if (
        [ fullName , username , email , password ].some( (field) =>
        //if field is not there,it will return undefined(not Error){due to optional chaining}
        //if field is there, it will trim the field, after trimming it will check whether the  is "",i.e,empty or not
        field?.trim() ===""
        )
    ) {
        throw new ApiError( 400 , "All fields are required")
    }
    //the above written if code is just an small versun of above line by line checking of error, here our motive is to check for whether there is any empty field or not
    //so first from all the input fields ny using .some() we are cheking whether any condition is passing or not...
    //the condition is writen as a call back, where it checks , that if there , field exists,it will trim it and see whether this is null or not
    //if the field is null, then conditio is passed and we came to now that the user has some field missing while regisstering  
    //SO AS the output, thee message will be thrown to the user



    //STEP-3
    //Check whether the user already exists or not 
    //pure mongoDb queries(written in copy)
    const existedUser = await User.findOne({
        $or : [{username} , {email}]
    })
    //the above code,checks, fndOne,means from database if any one existing entry
    //matches with either username or email with the urrent input,means user already exists

    //so if already exxists, then throw error
    if(existedUser){
        throw new ApiError(409,"User with email or username already exist")
    }
    



    //STEP-4
    //cheking for media objects,like image, avatar,pddfs
    //just like req.body , multer provides us a req.files
    //1st lets check for the local path, bec 1st the img will go to the local pah and then to cloudinary
    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;
    //cover image ta must par na, toh idare onno bhabe check korte hoibo
    //req.files er jodi kunu array tthaake, r ui aarray er length jodi >0 hoy, toile oi code ta kaaj korbo, er mane coverimage initially na dile code ta execute oi hoitona
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    //if not inseted, show error
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar ic required")
    }
    //imgae is not so necsssary, can be put later, in fact if e wnat avatar field is also not that important, can be inserted later, just to show we have given

    //SSTEP-5
    //now upload the images to cloudinary
    //this sometimes may take time, though thiss whole function is n async type
    //but untill and unless our image gets uploaded we should not proceed
    //so here not async, but await should be used
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    //above here, uploadOnCloudinry is a pre-written function which takes the photo from the local patg and puts it n the cloudinary
     //tph aibar jodi amar required field ta na upload hoy kunu karon bosoto, th api eror throw koro chup chap
     if (!avatar) {
        throw new ApiError(400,"Avatar ic required")
     }



    //STEP-6
    //create usr object , create in db
    //mane uporer ja ja field ase sob jodi thik thakk bhabe fullfill hoia take , toh user jeida ase ui object ta cretae hoia gelo, aibar ui user ibject ta re amra db te insert korum
    //this may also be time consuming, and untill and unless the user is creted we should not move forwra, bec this may case some erroe afterwardss

    const user = await User.create({
        fullName,
        avatar : avatar.url, //since this field was a reqd field
        coverImage : coverImage?.url || "",//since this is not a musr field, so if user does not give anything,keep thid field empty, and if user gives something we can fetch the url from it
        email,
        password,
        username : username.toLowerCase() //i want everything to e stored on db in lowercase


    })

    // STEP-7
    //now lets check whether whether the user is crete or noe, just to be double sure
    //mongoDb itself provides an id to the user
    //the benefit of using tthis method is that, we can remove the password and tokens fiel from response
    //by a method .select()   .....ja ja bad demu ssudhu ui field di dselect er moddhe lekhum ta o minus(-) sign aage diya

    const createdUser = await User.findById(user._id).select(
        " -password -refreshToken"
    )
    //karon at the end jokhon ami response demu, tokhon ami chai na jen passwrd r token ta o jate loge response a jay, ichcha upor dependent , haile ami paswrod o show koraite pari, but dewa thik na

    // STEP-8
    //if user is by any chance not create then throw error, but this time it will be an server error
    if (!createdUser) {
        throw new ApiError(500,"Something went wrong while registering the user")

    }



    // STEP-9
    //response has to be send on creation of the user
    //for this ApiResponse is reqd
    //with status code 201, we will also end the cretedusrere item in a json ormat
    //all wil sen just in the format of apiresponse function
    return res.status(201).json(
        new ApiResponse(200 , createdUser , "User registered Successfully")
    )

    
})

/***********  REGISRATION CODE COMPLETED SUCCESSFULLY********/



/*********** LET'S MAKE A CONTROLLER FOR USER LOGIN ********/
const loginUser =  asyncHandler( async(req,res) => {
    //steps includded are:
    //1.from req body->bring data
    //2.criteria selection : username/emaol/phone number/etc.
    //3.find user from db w.r.t to above criteria
    //4.check password w.r.t to above criteria stored in dB and also by user
    //5.if pasword cheked, send access and refresh tokens
    //6.send tokens via cookies

    /*****step-1 */
    //feching details from body
    //its upto us what e require
    //we may either require username or password or both or somethhing differnt
    const {email,username,password} = req.body

    /********step-2 */
    //eg.,1.suppose only username is required
    // if( !username){
    //     throw new ApiError(400,"Username is required")
    // }
     //eg.,2.suppose only email  is required
    // if( !email ){
    //     throw new ApiError(400," email is required")
    // }

      //eg.,3.suppose either username and email, both are required
    // if( !username || !email){
    //     throw new ApiError(400,"Username and Email, both required")
    // }

    console.log(email)

    //eg.,4.suppose either username or email, any one of thhem required
    if( !(username || email)){
        throw new ApiError(400,"Username or Email is required")
    }
    // both same code, above and below
    // if( !username && !email){
    //     throw new ApiError(400,"Username or Email is required")
    // }


    /***********STEP-3 */
    //finding user in db
    //criteria is either username or email,any one is required
    //jehetu db amara arek continent a saved ase, toh khujte time lagte oi pare
    const user = await User.findOne({ 
        $or : [{username},{email}] , 

        
    })
    //if not found
    if(!user){
        throw new ApiError(404,"User does not exists")
    }


    /***********STEP-4 */
    //password milamu, ai user er respect a db te jei hashed passoed ta stored ase, uiudar loge okhon ai user login er time a jei pssword ta input a dise ui duida re match koramu
    //aidike amra user entity hisabe jeid amra uporer user hisabe create korsi uida re oi nemu
    //password nemu hoise jeida re user login er somoy input hisabe ditase
    const isPasswordValid = await user.isPasswordCorrrect(password)
    
    //if password incorrect
    if(!isPasswordValid){
        throw new ApiError(401,"Password is incorrect")
    }


    ///*******STEP-5 & 6 */
    //access and refresh token generation


    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    //i dont want to give the password and  refresh token to user
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        //making secure the connection
        httpOnly: true,
        secure: true
    }

    //now letss return a response
    //we can send as many cookies we want
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )


    
    






    

})


/************************** LOGOUT   ***********************************/
    //how to logout?
    //1.clear all the cookies first
    //2.refresh token aalso has to be reset

    //find the usser, but find korum kmne, id oitto nai, karon user re ami logout koira demu nani
    //->for doing this, lets design our own middlewarere, auth.middleware.js

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})



// const refreshAccessToken = asyncHandler(async (req, res) => {
//     const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

//     if (!incomingRefreshToken) {
//         throw new ApiError(401, "unauthorized request")
//     }

//     try {
//         const decodedToken = jwt.verify(
//             incomingRefreshToken,
//             process.env.REFRESH_TOKEN_SECRET
//         )
    
//         const user = await User.findById(decodedToken?._id)
    
//         if (!user) {
//             throw new ApiError(401, "Invalid refresh token")
//         }
    
//         if (incomingRefreshToken !== user?.refreshToken) {
//             throw new ApiError(401, "Refresh token is expired or used")
            
//         }
    
//         const options = {
//             httpOnly: true,
//             secure: true
//         }
    
//         const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
//         return res
//         .status(200)
//         .cookie("accessToken", accessToken, options)
//         .cookie("refreshToken", newRefreshToken, options)
//         .json(
//             new ApiResponse(
//                 200, 
//                 {accessToken, refreshToken: newRefreshToken},
//                 "Access token refreshed"
//             )
//         )
//     } catch (error) {
//         throw new ApiError(401, error?.message || "Invalid refresh token")
//     }

// })


export { registerUser , loginUser , logoutUser}