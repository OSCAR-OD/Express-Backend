const multer = require("multer");
const path = require("path");

//const UPLOADS_FOLDER = "public/uploads/";
const UPLOADS_FOLDER = "../uploads/";

 var upload = multer({
     dest: UPLOADS_FOLDER });

     module.exports = { upload };
