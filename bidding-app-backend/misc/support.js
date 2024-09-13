const path = require('path');
const fs = require('fs');
const multer = require('multer');

function delete_img(image){
    const imagePath = path.join(__dirname,'..', 'uploads', image);
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
    return true;
}

const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname,'..', 'uploads');
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      if (mimetype && extname) {
        return cb(null, true);
      }
      cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.'));
    }
  });

module.exports = {delete_img, upload}