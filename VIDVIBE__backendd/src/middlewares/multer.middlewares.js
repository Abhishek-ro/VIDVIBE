import multer from "multer";
import path from "path";
import fs from "fs";
// Set up storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
   
    const uploadPath = path.resolve("public", "temp");
    cb(null, uploadPath); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    // Use originalname or any custom logic for filenames
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.originalname.split(".")[0] +
        "-" +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});


const deleteFileFromLocalPath = (filePath) => {
  try {
    const resolvedPath = path.resolve(filePath); // Resolve the full path
    if (resolvedPath) {
      fs.unlinkSync(resolvedPath); // Delete the file
      console.log(`File deleted successfully.`);
    } else {
      console.log(`File not found at ${resolvedPath}.`);
    }
  } catch (error) {
    console.error("Error while deleting the file:", error);
  }
};
const upload = multer({ storage });


export { deleteFileFromLocalPath , upload };



