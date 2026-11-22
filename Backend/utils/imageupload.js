const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

const missingCloudinaryVariables = [
  ['CLOUDINARY_CLOUD_NAME', cloudinaryConfig.cloud_name],
  ['CLOUDINARY_API_KEY', cloudinaryConfig.api_key],
  ['CLOUDINARY_API_SECRET', cloudinaryConfig.api_secret],
]
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missingCloudinaryVariables.length > 0) {
  console.error(
    `Cloudinary is not configured. Missing environment variables: ${missingCloudinaryVariables.join(', ')}`,
  );
}

cloudinary.config({
  ...cloudinaryConfig,
});

const uploadImageToCloudinary = async (base64Image, folder) => {
  try {
    if (!base64Image || !folder) {
      throw new Error('Missing required parameters: base64Image or folder');
    }

    if (missingCloudinaryVariables.length > 0) {
      throw new Error(
        'Cloudinary upload is unavailable because the backend Cloudinary environment variables are not configured',
      );
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
