const express = require('express')
//const multer = require("multer");
const router = express.Router()
//const verifyJWT = require('../middleware/verifyJWT')
//const { upload } = require("../utils/fUpload");
//const { upload } = require("../utils/fileUpload");
//const { upload } = require("../utils/smUpload");
const productsController = require('../controllers/productsController')

//router.use(verifyJWT)

router.route('/')
.post( productsController.createNewProduct)
 
   // .get(productsController.getAllProducts)
//    .post(upload.single("image"), productsController.createNewProduct, (req, res, next) => {
//     res.send("success");
//   })

  //   .post( upload.single("image"),
  //   (req, res, next) => {
  //     res.send("success");
  //   }
  // );

  //   .post(upload.single("image"), productsController.createNewProduct)
  

// .patch(usersController.updateUser)
    //.delete(usersController.deleteUser)

module.exports = router
