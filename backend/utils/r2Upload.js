const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');

// Initialize R2 client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Upload image to R2
const uploadToR2 = async (file, productId) => {
  try {
    const fileExtension = path.extname(file.originalname);
    const fileName = `product_${productId}_${Date.now()}${fileExtension}`;
    const key = `products/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await r2Client.send(command);
    
    // Return public URL
    return `${process.env.R2_PUBLIC_URL}/${key}`;
  } catch (error) {
    console.error('R2 upload error:', error);
    throw new Error('Failed to upload image');
  }
};

// Delete image from R2
const deleteFromR2 = async (imageUrl) => {
  try {
    if (!imageUrl) return;
    
    // Extract key from URL
    const key = imageUrl.replace(`${process.env.R2_PUBLIC_URL}/`, '');
    
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });

    await r2Client.send(command);
  } catch (error) {
    console.error('R2 delete error:', error);
    // Don't throw error for delete failures
  }
};

module.exports = { uploadToR2, deleteFromR2 };