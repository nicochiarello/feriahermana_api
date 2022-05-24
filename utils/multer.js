const multer = require("multer");
const path = require("path");

exports.upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if ((ext !== ".jpg") & (ext !== ".jpeg") & (ext !== ".png")) {
      cb(new Error("El tipo de extension de archivo no es soportado"), false);
    }
    cb(null, true);
  },
});
