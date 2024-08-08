import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
const uploadOnCloudinary = async (localPath) => {
  try {
    if (!localPath) {
      return null;
    }
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const uploadResult = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localPath);
    return uploadResult;
  } catch (error) {
    console.log(`Error while uploading file`);
    fs.unlinkSync(localPath);
  }
};

export { uploadOnCloudinary };
