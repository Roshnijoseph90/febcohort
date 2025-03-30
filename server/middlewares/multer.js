import multer, { diskStorage } from 'multer';
//import path from 'path';
const storage = diskStorage({
  filename: function (req, file, cb) {
    console.log("file", file);
   
   cb(null, file.originalname);
  }
});


export const upload = multer({ storage: storage });

