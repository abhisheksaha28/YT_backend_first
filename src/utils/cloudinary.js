import {v2 as cloudinary} from 'cloudinary';
//import { response } from 'express';
import fs from "fs";

 
//configure the cloudinary          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


//********* SETUP THE CODE FOR CLOUDINARY CONNECTION AND IT'S USAGE **********/

const uploadOnCloudinary = async (localFilePath) => {
    try {
        //jodi local storae a save na hoy
        if(!localFilePath) return null; //chaiile ekta error msg o deon jaito
        
        //upload the file in cloudinary
        //uplaod korte time toh laagte oi pare, eerliga amra await use korum
        const response = await cloudinary.uploader.upload(localFilePath, {
          resource_type : "auto"  //it can be video,img, file, etc etc
          //ifn we have some specified things only, then we can specify, like img, video,etc
 
        })
        //fie upload jokho succesful hoibo, amra console log korum, loge loge, resonse er url d o dia demu
        //*=>console.log("File is uploaded successfully on Cloudinary" , response.url);

        //jodi upload hoia jay, uporer console log ta doekar nai, just checking er liga raksilam
        //aibar jehtu sob thik thk kaaj  kortase, aibar amra delete koira demu media files ti re amrar local storage thika
        //synchronously unlink korum, karon unlink houner pore oi amra age forward homu
        fs.unlinkSync(localFilePath);

        return response;

    }
    catch (error) {
      //jodiupload hoia jayga, nijer server a ami chai na jate code ta store thak
      //spae o khaibo + seurity issues o generate korte pare
      // toh ami delete korum local storage thika, basically fs module er unlink property diya kora hoy ida
      fs.unlink(localFilePath) // remove the locally saved temporary file as the upload operation got failed
      
      return null;
    }
}


  export { uploadOnCloudinary };