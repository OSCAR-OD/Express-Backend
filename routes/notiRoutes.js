const express = require('express')
const router = express.Router()
const notisController = require('../controllers/notisController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(notisController.getAllNotes)
    .post(notisController.createNewNote)
    .patch(notisController.updateNote)
    .delete(notisController.deleteNote)

module.exports = router