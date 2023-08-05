const express = require('express')
//const multer = require("multer");
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')
//const { upload } = require("../utils/fUpload");
//const { upload } = require("../utils/fileUpload");
//const { upload } = require("../utils/smUpload");
const postsController = require('../controllers/postsController')
// router.use(verifyJWT)

// router.route('/')
//  .get(postsController.getAllPosts)
// .post( postsController.createNewPost);
 
router.route('/').post(verifyJWT, postsController.createNewPost);

router.route('/').get(postsController.getAllPosts);

// router.get('/postsForEmployee', postsController.getPostsForEmployee);
//router.patch('/posts/:postId/markAsViewed', postsController.markPostAsViewed);

// .get(postsController.getAllProducts)
//    .post(upload.single("image"), postsController.createNewProduct, (req, res, next) => {
//     res.send("success");
//   })

  //   .post( upload.single("image"),
  //   (req, res, next) => {
  //     res.send("success");
  //   }
  // );

  //   .post(upload.single("image"), postsController.createNewProduct)
  

// .patch(usersController.updateUser)
    //.delete(usersController.deleteUser)

module.exports = router
