import "dotenv/config";
import express from "express";
import connectToDB from "./config/db.js";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import File from "./models/fileUploadModel.js";

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());

//folder storage, this will create a folder in the root directory
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Upload endpoint and a handler
app.post("/api/files/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded",
    });
  }

  //Make sure you store an absolute path in the database. Easier to work with and secure.
  const relativePath = path.relative(process.cwd(), req.file.path);

  const newFile = new File({
    name: req.file.originalname,
    mimetype: req.file.mimetype,
    path: relativePath,
  });

  await newFile.save();

  res.status(201).json({
    message: "File Uploaded Successfully",
    file: req.file,
  });
});

app.get("/api/files/:filename", async (req, res) => {
  const filename = req.params.filename;
  const file = await File.findOne({ name: filename });

  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  const fullPath = path.join(process.cwd(), file.path);
  res.download(fullPath, filename);
});

app.get("/api/files", async (req, res) => {
  try {
    const files = await File.find().exec();
    res.status(200).json({
      resuls: files.length,
      data: files,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching files" });
  }
});

app.listen(PORT, async () => {
  console.log(`Server running at PORT:${PORT}`);
  await connectToDB();
});
