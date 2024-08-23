const path = require('path');
const multer = require('multer');

// photo storage
const photoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: function (req, file, cb) {
    if (file) {
      cb(null, new Date().toISOString().replace(/:/g,'-') + file.originalname);
    } else {
        cb(null , false);
    }  
  },
});


// photo Upload middleware
const photoUpload = multer({
  storage: photoStorage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image") ) {
      cb(null, true);
    } else {
      cb({ message: "That file type is not allowed" }, false);
    }
  },
});

module.exports = photoUpload;