const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const loginLimiter = require('../middleware/loginLimiter')

router.route('/')
    .post(loginLimiter, authController.login)

router.route('/refresh')
    .get(authController.refresh)

router.route('/logout')
    .post(authController.logout)

 router.route('/register')
 .post(authController.register);

 router.route('/forgotPassword')
 .post(authController.forgotPassword);
 
 router.route('/resetPassword/:resetToken')
 .put(authController.resetPassword);

module.exports = router