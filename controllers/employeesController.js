const Employee = require('../models/Employee')
const Note = require('../models/Note')
const bcrypt = require('bcrypt')
//const cloudinary = require("../utils/cloudinary");
const cloudinary = require('../utils/fileUploadCloudinary')
// @desc Get all employees
// @route GET /employees
// @access Private
const getAllEmployees = async (req, res) => {
    // Get all employees from MongoDB
    const employees = await Employee.find().select('-password').lean()

    // If no employees 
    if (!employees?.length) {
        return res.status(400).json({ message: 'No employees found' })
    }

    res.json(employees)
}

// @desc Create new employee
// @route POST /employees
// @access Private

const createNewEmployee = async (req, res) => {
    const { name, email, password, roles } = req.body

    // Confirm data
    if (!name|| !email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate employeename
    const duplicate = await Employee.findOne({ email }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate employee email' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const employeeObject = (!Array.isArray(roles) || !roles.length)
        ? { name, email, "password": hashedPwd }
        : { name, email, "password": hashedPwd, roles }

    // Create and store new employee 
    const employee = await Employee.create(employeeObject)

    if (employee) { //created 
        res.status(201).json({ message: `New employee ${email} created` })
    } else {
        res.status(400).json({ message: 'Invalid employee data received' })
    }
}

// @desc Update a employee
// @route PATCH /employees
// @access Private

const updateEmployee = async (req, res) => {
    const { id, name, email, roles, active, password } = req.body

    // Confirm data 
    if (!id || !name || !email || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    // Does the employee exist to update?
    const employee = await Employee.findById(id).exec()

    if (!employee) {
        return res.status(400).json({ message: 'Employee not found' })
    }

    // Check for duplicate 
    const duplicate = await Employee.findOne({ email }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original employee 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate employeeemail' })
    }

    employee.name = name
    employee.email = email
    employee.roles = roles
    employee.active = active

    if (password) {
        // Hash password 
        employee.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    const updatedEmployee = await employee.save()

    res.json({ message: `${updatedEmployee.email} updated` })
}

  // @desc Update own Profile
// @route PATCH /employees
// @access Private
const updateProfile = async (req, res) => {
    const { id, name, email, roles, active, image} = req.body
    try {
    // Confirm data 
// || !image
    if (!id || !name || !email || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' })
    }
  
    // Does the employee exist to update?
    const employee = await Employee.findById(id).exec()
  
    if (!employee) {
        return res.status(400).json({ message: 'Employee not found' })
    }
    return res.json({ message: 'Employee found' })
    // Check for duplicate 
   // const duplicate = await Employee.findOne({ email }).collation({ locale: 'en', strength: 2 }).lean().exec()
  
    // Allow updates to the original employee 
    // if (duplicate && duplicate?._id.toString() !== id) {
    //     return res.status(409).json({ message: 'Duplicate employeeemail' })
    // }
  
    employee.name = name
    employee.email = email
    employee.roles = roles
    employee.active = active
  
    if (password) {
        // Hash password 
        employee.password = await bcrypt.hash(password, 10) // salt rounds 
    }
    if(image){
        const uploadedResponse = await cloudinary.uploader.upload(image, {
        upload_preset: "Employee",
        });
       }
  if (uploadedResponse) {
  const updatedEmployee = await employee.save()
   res.json({ message: `${updatedEmployee.email} image updated` })
  }
}
  catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

// @desc Delete a employee
// @route DELETE /employees
// @access Private
const deleteEmployee = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Employee ID Required' })
    }

    // Does the employee still have assigned notes?
    const note = await Note.findOne({ employee: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'Employee has assigned notes' })
    }

    // Does the employee exist to delete?
    const employee = await Employee.findById(id).exec()

    if (!employee) {
        return res.status(400).json({ message: 'Employee not found' })
    }

    const result = await employee.deleteOne()

    const reply = `Employeename ${result.email} with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    updateProfile,
    deleteEmployee
}