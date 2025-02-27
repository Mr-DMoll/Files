// Controller for handling file operations
import { GridFsStorage } from "multer-gridfs-storage";
import mongoose from "mongoose";
import File from "../models/fileUploadModel.js";

/**
 * Uploads a file to GridFS and stores its metadata.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded",
    });
  }

  // Store file metadata in the database
  const newFile = new File({
    name: req.file.filename,
    mimetype: req.file.contentType,
  });

  await newFile.save();

  res.status(201).json({
    message: "File Uploaded Successfully",
    file: req.file,
  });
};

/**
 * Downloads a file from GridFS by its filename.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const downloadFile = async (req, res) => {
  const filename = req.params.filename;

  try {
    const db = mongoose.connection;
    const filesCollection = db.collection("fs.files");
    const file = await filesCollection.findOne({ filename: filename });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "fs",
    });

    const downloadStream = bucket.openDownloadStream(file._id);

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", file.contentType);

    downloadStream.on("error", (err) => {
      console.error("Error downloading file:", err.message);
      res.status(500).json({ message: "Error downloading file" });
    });

    downloadStream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error downloading file" });
  }
};

/**
 * Retrieves all files from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const getAllFiles = async (req, res) => {
  try {
    const files = await File.find().exec();
    res.status(200).json({
      results: files.length,
      data: files,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching files" });
  }
};
