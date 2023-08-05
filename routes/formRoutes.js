const express = require('express')
const router = express.Router()
const formsController = require('../controllers/formsController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(formsController.getAllForms)
    .post(formsController.createNewForm)
    //.patch(notesController.updateNote)
    //.delete(notesController.deleteNote)

module.exports = router