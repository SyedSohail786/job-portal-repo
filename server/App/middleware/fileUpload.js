// middleware/fileUpload.js

const multer = require("multer");
const path = require("path");

const storage = (pathName) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, pathName);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname);
    },
  });

const uploads = (pathName) => multer({ storage: storage(pathName) });

module.exports = { uploads };
