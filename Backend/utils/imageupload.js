const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageToCloudinary = async (base64Image, folder) => {
  try {
    if (!base64Image || !folder) {
      throw new Error('Missing required parameters: base64Image or folder');
    }

    const upload = await cloudinary.uploader.upload(base64Image, {
      folder,
      resource_type: 'image',
    });

    return upload.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

module.exports = { uploadImageToCloudinary };
