const express = require("express");
const router = express.Router();

const User = require("../models/user.model");
const { hashPassword, comparePasswords } = require("../utils/bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("../utils/multer");
const sharp = require("../utils/sharp");

const authConfig = require("../config/auth.json");
const { uploadFile } = require("../utils/s3");

const generateToken = (params) => {
  return jwt.sign({ id: params.id }, authConfig.secret, {
    expiresIn: 86400,
  });
};

router.post("/register", multer.single("file"), async (req, res) => {
  const user = {
    username: req.body.username,
    password: await (async () => {
      if (req.body.username && req.body.password && req.body.email) {
        return await hashPassword(req.body.password);
      }
    })(),
    email: req.body.email,
    img: req.file
      ? await (async () => {
          const newPath = await sharp.compressImage(req.file, 500);
          await uploadFile(newPath)
            .then((result) => {
              return result.Location;
            })
            .catch((err) =>
              res.status(500).send({
                message: "Failed to upload on S3",
              })
            );
        })()
      : null,
  };

  if (!(await User.findOne({ username: req.body.username }))) {
    if (!(await User.findOne({ email: req.body.email }))) {
      let newUser = new User(user);

      newUser.save(function (err, user) {
        if (err) {
          return res.status(500).json({
            error: err._message,
          });
        }
        return res.status(201).json({
          user,
          token: generateToken({ id: user._id }),
        });
      });
    } else {
      return res.status(406).send({
        message: "E-mail already used!",
      });
    }
  } else {
    return res.status(409).send({
      message: "Username already used!",
    });
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    User.findOne({
      username,
    })
      .select("+password")
      .then(async (user) => {
        if (!user) {
          return res.status(403).json({
            message: "No user found!",
          });
        }

        if (await comparePasswords(password, user.password)) {
          user.password = undefined;

          return res
            .status(200)
            .json({ user, token: generateToken({ id: user._id }) });
        }

        return res.status(403).json({
          message: "Failed on login!",
        });
      })
      .catch((err) => {
        res.json({
          error: err._message,
        });
      });
  }
});

router.get("/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User not found",
        });
      }

      return res.send({
        user,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        err,
      });
    });
});

module.exports = router;
