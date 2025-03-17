import multer from "multer";
import path from "path";
import fs from "fs";

// Set up storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve("public", "temp");

    // ✅ Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
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

// Function to delete a file from a given local path
const deleteFileFromLocalPath = (filePath) => {
  try {
    const resolvedPath = path.resolve(filePath);
    if (fs.existsSync(resolvedPath)) {
      fs.unlinkSync(resolvedPath);
      console.log(`File deleted successfully: ${resolvedPath}`);
    } else {
      console.log(`File not found: ${resolvedPath}`);
    }
  } catch (error) {
    console.error("Error while deleting the file:", error);
  }
};

// Multer middleware
const upload = multer({ storage });

export { deleteFileFromLocalPath, upload };
