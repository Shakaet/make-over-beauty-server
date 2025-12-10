import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import config from "../config/index.js";

// Cloudinary config
cloudinary.config({
  cloud_name: config.Cloud_Name,
  api_key: config.Api_Key,
  api_secret: config.Api_Secret,
});

// ----- Memory Storage for Multer -----
export const upload = multer({
  storage: multer.memoryStorage(), // <-- No local folder
});

// ----- Cloudinary Upload from Buffer -----
export const sendImagetoCloudinary = async (imageName, fileBuffer) => {
  try {
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            public_id: imageName,
            folder: "products",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(fileBuffer); // <-- upload buffer
    });

    return uploadResult;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};
