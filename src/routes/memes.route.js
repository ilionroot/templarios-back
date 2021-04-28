const express = require("express");
const router = express.Router();

const Meme = require("../models/meme.model");

router.get("/all", async (req, res) => {
  await Meme.find(req.query.id ? { id_user: req.query.id } : {})
    .sort({ date: -1 })
    .then((memes) => {
      return res.status(200).json({
        memes,
      });
    })
    .catch((err) => {
      res.status(500).json({
        err: err,
      });
    });
});

router.get("/one", async (req, res) => {
  await Meme.findOne({ _id: req.query.id })
    .then((meme) => {
      if (!meme) {
        return res.status(404).send({
          message: "ID Inválido",
        });
      }

      res.send({
        meme,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        err,
      });
    });
});

module.exports = router;
