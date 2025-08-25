// src/multer-config.ts
import multer from "multer";
import path from "path";

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    // Create a unique filename to avoid overwriting files
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Create the multer instance
const upload = multer({ storage: storage });

export default upload;