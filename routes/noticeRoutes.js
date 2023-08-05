const express = require('express')
//const multer = require("multer");
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')
//const { upload } = require("../utils/fUpload");
//const { upload } = require("../utils/fileUpload");
//const { upload } = require("../utils/smUpload");
const noticesController = require('../controllers/noticesController')
router.use(verifyJWT)

router.route('/')
.get(noticesController.getAllNotices)
.post( noticesController.createNewNotice);
 
router.get('/noticesForEmployee', noticesController.getNoticesForEmployee);
//router.patch('/notices/:noticeId/markAsViewed', noticesController.markNoticeAsViewed);

// .get(noticesController.getAllProducts)
//    .post(upload.single("image"), noticesController.createNewProduct, (req, res, next) => {
//     res.send("success");
//   })

  //   .post( upload.single("image"),
  //   (req, res, next) => {
  //     res.send("success");
  //   }
  // );

  //   .post(upload.single("image"), noticesController.createNewProduct)
  

// .patch(usersController.updateUser)
    //.delete(usersController.deleteUser)

module.exports = router
