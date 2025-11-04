const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');

// Load environment variables (like your API keys)
dotenv.config();

// 1. Configure Cloudinary
// (This tells the library who you are)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Set up Cloudinary Storage
// (This tells Multer WHERE to send the files)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    // This creates a folder named 'agriconnect' in your Cloudinary account
    folder: 'agriconnect', 
    // This allows these file types
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

// 3. Configure Multer
// (This is the actual "bouncer" middleware)
const upload = multer({ 
  storage: storage // Tell Multer to use the Cloudinary storage we just set up
});

// 4. Export the bouncer
module.exports = upload;