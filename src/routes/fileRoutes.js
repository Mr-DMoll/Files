// Routes for file operations
import express from "express";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import {
  uploadFile,
  downloadFile,
  getAllFiles,
} from "../controllers/fileController.js";

const fileRouter = express.Router();

const url = process.env.MONGO_URI;

// Multer config for GridFS
const storage = new GridFsStorage({
  url: url,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const fileInfo = {
        filename: file.originalname,
        bucketName: "fs", // Default bucket name
      };
      resolve(fileInfo);
    });
  },
});

const upload = multer({ storage });

// Upload endpoint
fileRouter.post("/upload", upload.single("file"), uploadFile);

// Download endpoint
fileRouter.get("/:filename", downloadFile);

// Get all files endpoint
fileRouter.get("/", getAllFiles);

export default fileRouter;
