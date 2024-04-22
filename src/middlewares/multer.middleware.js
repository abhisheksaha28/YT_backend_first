import multer from "multer";


//************ CONFIGUR3E THE MULTER  ******/
// THE BELOW CODE IS DIRECTLY AVAILABLE IN THE DOCMENTATION, READ THAT
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //req a normal json data aile uida toh amra configure kortam oi pari,
        //but kunu file aie configgure normally kora jay na, so we use multer
        //as we can see, its passing a file as parametr, here all th3e fils will b3 send

      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
      //file.multiple_opttions ,  but we are going with the original name, though that's not a good practie
      //be tthe same user can upload multiple files with saame name, so ther will be over writing
      //but since the file is gonna be stored for a very small period of time, we can use this
      //+>>better was if we had provvided id's for each upload 
      
    }
  })
  
export const upload = multer({ 
    storage, 
})