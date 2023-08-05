const Team = require('../models/Team')
const Employee = require('../models/Employee')

// @desc Get all teams 
// @route GET /teams
// @access Private
const getAllTeams = async (req, res) => {
    // Get all teams from MongoDB
    
    const teams = await Team.find().lean()

    // If no teams 
    if (!teams?.length) {
        return res.status(400).json({ message: 'No teams found' })
    }

    const teamsWithEmployee = await Promise.all(teams.map(async (team) => {
        const employees = await Employee.find({ _id: { $in: team.members } }).lean().exec()
        const emails = employees.map(employee => employee.email)
        return { ...team, emails }
    }))

    res.json(teamsWithEmployee)
 
}

// @desc Create new team
// @route POST /teams
// @access Private
const createNewTeam = async (req, res) => {

    const {title, category, description, members  } = req.body
//req.user.id
    // Confirm data
    if (!title || !category || ! description || !members) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate title
    const duplicate = await Team.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

    
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate team title' })
    }

    let teamManager=req.user.id;
  // console.log("teamManager",teamManager);
     // Create and store the new employee 
    const team = await Team.create({ teamManager, title, category, description, members})

    if (team) { // Created 
        return res.status(201).json({ message: 'New team created' })
    } else {
        return res.status(400).json({ message: 'Invalid team data received' })
    }

}

// @desc Update a team
// @route PATCH /teams
// @access Private
const updateTeam = async (req, res) => {
    const { id, members, title, description, category, completed } = req.body

    // Confirm data
    if (!id || !members || !title || !description || !category|| typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm team exists to update
    const team = await Team.findById(id).exec()

    if (!team) {
        return res.status(400).json({ message: 'Team not found' })
    }

    // Check for duplicate title
    const duplicate = await Team.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow renaming of the original team 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate team title' })
    }
    team.teamManager=req.user.id
    team.title = title
    team.description = description
    team.category = category
    team.members = members
    team.completed = completed

    let updatedTeam;
    try {
        updatedTeam = await team.save();
    } catch (error) {
        // Handle the error case
        return res.status(500).json({ message: 'Failed to update team' });
    }
    if (updatedTeam) {
        res.json(`'${updatedTeam.title}' updated`);
    } else {
        res.status(500).json({ message: 'Failed to update team' });
    }
}


// @desc Delete a team
// @route DELETE /teams
// @access Private
const deleteTeam = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Team ID required' })
    }

    // Confirm team exists to delete 
    const team = await Team.findById(id).exec()

    if (!team) {
        return res.status(400).json({ message: 'Team not found' })
    }

    const result = await team.deleteOne()

    const reply = `Team '${result.title}' with ID ${result._id} deleted`

    res.json(reply)
}


module.exports = {
    getAllTeams,
    createNewTeam,
    updateTeam,
    deleteTeam
}