const express = require("express");
const router = express.Router();

const Meme = require("../models/meme.model");
const User = require("../models/user.model");

const multer = require("../utils/multer");
const sharp = require("../utils/sharp");

const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware);

router.post("/upload", multer.single("file"), async (req, res) => {
  if (req.file && req.userId && req.body.description) {
    await sharp
      .compressImage(req.file, 250)
      .then(async (newPath) => {
        User.findOne({ _id: req.userId })
          .then(async (user) => {
            if (!user) {
              return res.status(403).json({ message: "Invalid user ID!" });
            }

            const filename = newPath.split("/")[newPath.split("/").length - 1];

            let meme = new Meme({
              src: filename,
              id_user: req.userId,
              user: user.username,
              userImg: user.img,
              description: req.body.description,
              date: new Date(Date.now()).toISOString(),
            });

            await meme.save((err) => {
              if (err) {
                return res.status(500).json({
                  err: err,
                });
              }

              return res.status(200).json({
                message:
                  "Upload e compressão realizados com sucesso! O novo caminho é:" +
                  newPath,
              });
            });
          })
          .catch((err) => res.status(500).json({ err }));
      })
      .catch((err) => console.log(err));
  } else {
    return res.status(500).json({ message: "Houve um erro no upload!" });
  }
});

module.exports = router;
