const multer = require("multer");
const path = require("path");

const maxSize = 50 * 1024 * 1024; // for 1MB

module.exports = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname + "../../../" + "public/uploads"));
    },

    filename: (req, file, cb) => {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },

    fileFilter: (req, file, cb) => {
      const isAccepted = [
        "image/png",
        "image/jpg",
        "image/jpeg",
        "image/webp",
        "video/mp4",
        "video/mpeg4",
        "video/H.263",
        "video/H.264",
        "video/webm",
        "video/mov",
        "video/MOV",
      ].find((formatoAceito) => formatoAceito == file.mimetype);

      if (isAccepted) {
        return cb(null, true);
      }

      return cb(null, false);
    },
  }),
  limits: { fileSize: maxSize },
});
