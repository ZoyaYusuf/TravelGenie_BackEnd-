import express from "express";
import multer from "multer";
import cloudinary from "../utils/cloudinary.js"; 
import streamifier from "streamifier"; // helps stream the file buffer
import { protect } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // keep file in memory

router.post("/", protect,upload.single("cover"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    // Upload to Cloudinary using stream
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "TravelGenie_Covers" }, // optional folder in Cloudinary
      (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ success: false, message: "Upload failed" });
        }
        // return Cloudinary's secure URL
        res.status(200).json({ success: true, imageUrl: result.secure_url });
      }
    );

    // convert buffer to stream
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;