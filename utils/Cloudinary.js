const cloudinary = require('cloudinary').v2;

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary upload function
const cloudinaryUploadImage = async (file) => {
  try {
    const data = await cloudinary.uploader.upload(file, {
      resource_type: 'image'
    });
    return data;
  } catch (error) {
    return error;
  }
};

// Cloudinary delete function
const cloudinaryRemoveImage = async (imagePublicId) => {
  try {
    const result = await cloudinary.uploader.destroy(imagePublicId);
    return result;
  } catch (error) {
    return error;
  }
};


module.exports = {
    cloudinaryUploadImage,
    cloudinaryRemoveImage,
};