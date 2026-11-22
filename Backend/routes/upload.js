const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/Authentication');
const { uploadImageToCloudinary } = require('../utils/imageupload');
const { analyzeFoodImage } = require('../utils/imageanalysis');

router.post('/analyze', authMiddleware, async (req, res) => {
  const { base64Image } = req.body || {};
  if (!/^data:image\/(jpeg|png|webp);base64,/i.test(base64Image || '')) {
    return res.status(400).json({
      success: false,
      message: "Only JPG, PNG, and WebP images are supported",
    });
  }

  try {
    const analysis = await analyzeFoodImage(base64Image);
    return res.status(200).json({ success: true, analysis });
  } catch (error) {
    console.error("AI image analysis failed:", error);
    return res.status(502).json({
      success: false,
      message: "AI image analysis failed",
      error: process.env.NODE_ENV === "development"
        ? error.response?.data?.error?.message || error.message
        : undefined,
    });
  }
});

// Route handler with better error handling
router.post('/', authMiddleware, async (req, res) => {
  console.log("Upload endpoint hit");
  
  try {
    // Validate request
    if (!req.body || !req.body.base64Image || !req.body.folder) {
      console.log("Missing fields:", {
        hasBody: !!req.body,
        hasImage: !!req.body?.base64Image,
        folder: req.body?.folder
      });
      return res.status(400).json({
        success: false,
        message: "Missing required fields: base64Image or folder"
      });
    }
    
    const { base64Image, folder } = req.body;
    const supportedImage = /^data:image\/(jpeg|png|webp);base64,/i.test(base64Image);

    if (!supportedImage) {
      return res.status(400).json({
        success: false,
        message: "Only JPG, PNG, and WebP images are supported"
      });
    }
    
    // Estimate size in bytes
    const estimatedSizeBytes = (base64Image.length * 0.75);
    const sizeInMB = estimatedSizeBytes / (1024 * 1024);
    const MAX_SIZE_BYTES = 10 * 1024 * 1024;

    if (estimatedSizeBytes > MAX_SIZE_BYTES) {
      return res.status(400).json({
        success: false,
        message: `Image size exceeds the maximum limit of 10MB (Current: ${sizeInMB.toFixed(2)}MB)`
      });
    }

    console.log(`Uploading image of size: ${sizeInMB.toFixed(2)}MB (${(sizeInMB / 1024).toFixed(3)}GB) to folder: ${folder}`);

    let analysis;
    try {
      analysis = await analyzeFoodImage(base64Image);
    } catch (analysisError) {
      console.error("AI image analysis failed; continuing upload:", analysisError);
      analysis = {
        status: "unavailable",
        reason: "AI analysis could not be completed.",
        isFood: null,
        appearsAiGenerated: null,
        freshness: "unknown",
        confidence: null,
        notes: [],
      };
    }
    
    // Upload to Cloudinary
    const imageUrl = await uploadImageToCloudinary(base64Image, folder);
    console.log("Upload successful, URL:", imageUrl);
    
    // Success response
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      url: imageUrl,
      analysis,
    });
  }
  catch (error) {
    console.error("Error uploading image:", error);
    
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message || 'Unknown error'
    });
  }
});

module.exports = router;
