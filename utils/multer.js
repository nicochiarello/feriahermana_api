const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname.replace(path.extname(file.originalname), "") +  path.extname(file.originalname));
  },
});

exports.upload = multer({ storage: storage });
