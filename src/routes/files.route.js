const express = require("express");
const router = express.Router();

const Meme = require("../models/meme.model");
const User = require("../models/user.model");

const multer = require("../utils/multer");
const sharp = require("../utils/sharp");
const thumbler = require("video-thumb");

const { uploadFile } = require("../utils/s3");

const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware);

const isVideo = (extension) => {
  switch (extension) {
    case "mp4":
      return true;
    case "webm":
      return true;
    case "mpeg4":
      return true;
    case "h.263":
      return true;
    case "h.264":
      return true;
    case "mov":
      return true;
    case "MOV":
      return true;
    default:
      return false;
  }
};

router.post("/upload", multer.single("file"), async (req, res) => {
  const extension = req.file.filename.split(".")[
    req.file.filename.split(".").length - 1
  ];

  if (req.file && req.userId && req.body.description) {
    if (!isVideo(extension)) {
      await sharp
        .compressImage(req.file, 250)
        .then(async (newPath) => {
          User.findOne({ _id: req.userId })
            .then(async (user) => {
              if (!user) {
                return res.status(403).json({ message: "Invalid user ID!" });
              }

              uploadFile(newPath)
                .then(async (result) => {
                  let meme = new Meme({
                    src: result.Location,
                    id_user: req.userId,
                    user: user.username,
                    isVideo: false,
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
                      message: "Upload e compressão realizados com sucesso!",
                    });
                  });
                })
                .catch((err) => {
                  res.status(500).send({
                    message: "Failed to upload on S3",
                  });
                });
            })
            .catch((err) => res.status(500).json({ err }));
        })
        .catch((err) => console.log(err));
    } else {
      User.findOne({ _id: req.userId })
        .then(async (user) => {
          if (!user) {
            return res.status(403).json({ message: "Invalid user ID!" });
          }

          uploadFile(req.file.path)
            .then(async (result) => {
              let meme = new Meme({
                src: result.Location,
                id_user: req.userId,
                isVideo: true,
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
                    "Upload realizado com sucesso! O novo caminho é:" +
                    req.file.path,
                });
              });
            })
            .catch((err) => {
              res.status(500).send({
                message: "Failed to upload on S3",
              });
            });
        })
        .catch((err) => res.status(500).json({ err: "sexl" }));
    }
  } else {
    console.log(userId);
    return res.status(500).json({ message: "Houve um erro no upload!" });
  }
});

module.exports = router;
