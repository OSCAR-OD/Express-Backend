const express = require('express')
const router = express.Router()
const employeesController = require('../controllers/employeesController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(employeesController.getAllEmployees)
    .post(employeesController.createNewEmployee)
    //.patch(employeesController.updateEmployee)
    //updateOwnProfile
    .patch(employeesController.updateProfile)
    .delete(employeesController.deleteEmployee)

module.exports = router
