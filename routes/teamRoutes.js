const express = require('express')
const router = express.Router()
const teamsController = require('../controllers/teamsController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(teamsController.getAllTeams)
    .post(teamsController.createNewTeam)
    .patch(teamsController.updateTeam)
    .delete(teamsController.deleteTeam)

module.exports = router