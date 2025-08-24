const { CloudinaryStorage } = require('@fluidjs/multer-cloudinary');
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'StayQuest_dev',  // Optional: Folder for uploaded files in Cloudinary
      allowed_formats: ['jpg', 'jpeg', 'png'],  // Optional: Restrict allowed file types
    }
  });

  module.exports={
    cloudinary,
    storage
  }