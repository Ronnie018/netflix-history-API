const multer = require("multer");
const path = require("path");

module.exports = {
  dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, "..", "..", "tmp", "uploads"));
    },
    filename: (req, file, cb) => {
      const extName = path.extname(file.originalname);
      cb(null, `data${extName}`);
    },
  }),
  limits: {
    filesize: 3 * 1024 * 1024, // ***
  },
  fileFilter: (req, file, cb) => {
    console.log(file);
    const allowedMimes = ["text/csv", "application/vnd.ms-excel"];

    if (allowedMimes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("invalid file type"));
  },
};
