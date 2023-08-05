const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createNewUser)
    //.patch(usersController.updateUser)
    //updateOwnProfile
    .patch(usersController.updateProfile)
    .delete(usersController.deleteUser);

router.get('/getProfile', usersController.getProfile);
router.patch('/updateProfile', usersController.updateProfile);


module.exports = router
