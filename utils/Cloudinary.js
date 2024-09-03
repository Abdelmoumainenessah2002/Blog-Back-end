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
    console.log(error);
    throw new Error("Internal server error occurred while uploading image(CLOUDINARY)");
  }
};

// Cloudinary delete function
const cloudinaryRemoveImage = async (imagePublicId) => {
  try {
    const result = await cloudinary.uploader.destroy(imagePublicId);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error(
      "Internal server error occurred while deleting image(CLOUDINARY)"
    );
  }
};

const cloudinaryRemoveMultipleImage = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error(
      "Internal server error occurred while deleting images(CLOUDINARY)"
    );
  }
};



module.exports = {
    cloudinaryUploadImage,
    cloudinaryRemoveImage,
    cloudinaryRemoveMultipleImage
};