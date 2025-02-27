import "dotenv/config";
import express from "express";
import connectToDB from "./config/db.js";
import fileRoutes from "./routes/fileRoutes.js";

/**
 * NOTE: if you have already installed multer which has a new version, multer@1.4.5, you might get dependency conflicts when installing gridfs which requires multer@1.4.2, so either force it or use the following flag:
 * npm install multer-gridfs-storage --legacy-peer-deps
 */
const app = express();
const PORT = process.env.PORT;

// Middleware

app.use(express.json());

// Use file routes
app.use("/api/files", fileRoutes);

app.listen(PORT, async () => {
  console.log(`Server running at PORT:${PORT}`);
  await connectToDB();
});
