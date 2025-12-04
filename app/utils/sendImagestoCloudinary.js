import express from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

import fs from "fs";
import config from "../config/index.js";

// Cloudinary Configuration
cloudinary.config({ 
  cloud_name: config.Cloud_Name, 
  api_key: config.Api_Key, 
  api_secret: config.Api_Secret
});

// Function to send image to Cloudinary
export let sendImagetoCloudinary = async (imageName, path) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(path, {
      public_id: imageName,
    });

    // Cloudinary upload শেষে local file delete
    try {
      await fs.promises.unlink(path);
    } catch (err) {
      console.error("❌ Failed to delete local file:", err);
    }

    return uploadResult; // result return হবে
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    throw error; // parent function handle করতে পারবে
  }
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + "/upload/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  }
});

export const upload = multer({ storage: storage });
