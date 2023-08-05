const Form = require('../models/Form')
const User = require('../models/User')

// @desc Get all forms 
// @route GET /forms
// @access Private
//  const getAllForms = async (req, res) => {
//      // Get all forms from MongoDB
//      //const forms = await Form.find().lean()
//      const forms = await Form.find({ user: req.user.id }).lean();
//      // If no forms 
//      if (!forms?.length) {
//          return res.status(400).json({ message: 'No forms found' })
//      }
//   // Add username to each form before sending the response 
//   // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
//   // You could also do this with a for...of loop
//   // const formsWithUser = await Promise.all(forms.map(async (form) => {
//   //     const user = await User.findById(form.user).lean().exec()
//   //     return { ...form, email: user.email }
//   // }))
//     // const formsWithUser = await Promise.all(forms.map(async (form) => {
//     //     const users = await User.find({ _id: { $in: form.user } }).lean().exec()
//     //     const emails = users.map(user => user.email)
//     //     return { ...form, emails }
//     // }))

// //     res.json(formsWithUser)
 
//  }
//////////////
const getAllForms = async (req, res) => {
    try {
      // Get all forms from MongoDB that match the req.user.id
      const forms = await Form.find({ user: req.user.id }).lean();
  
      // If no forms found
      if (!forms.length) {
        return res.status(400).json({ message: 'No forms found' });
      }
  
      res.json(forms);
     // console.log("forms",forms);
    } catch (error) {
      console.error('Error retrieving forms:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
/////////////
// @desc Create new form
// @route POST /forms
// @access Private
const createNewForm = async (req, res) => {
    const { 
  amount,
  checkbox1,
  checkbox2,
  billFirstName,
  billLastName,
  billAddress1,
   billCity,
  billState,
  billZipCode,
  sameAsBilling,
  shipFirstName,
  shipLastName,
  shipAddress1,
   shipCity,
  shipState,
  shipZipCode,
  optInNews,
  } = req.body

    // Confirm data
    // if (!user || !title || !text) {
    //     return res.status(400).json({ message: 'All fields are required' })
    // }

    // Check for duplicate title
    // const duplicate = await Form.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // if (duplicate) {
    //     return res.status(409).json({ message: 'Duplicate form title' })
    // }

    // Create and store the new user 
    const form = await Form.create({ 
    user:req.user.id,
   amount,
  checkbox1,
  checkbox2,
  billFirstName,
  billLastName,
  billAddress1,
   billCity,
  billState,
  billZipCode,
  sameAsBilling,
  shipFirstName,
  shipLastName,
  shipAddress1,
   shipCity,
  shipState,
  shipZipCode,
  optInNews,
   })

    if (form) { // Created 
        return res.status(201).json({ message: 'New Form created' })
    } else {
        return res.status(400).json({ message: 'Invalid form data received' })
    }

}

// @desc Update a form
// @route PATCH /forms
// @access Private

module.exports = {
    createNewForm,
    getAllForms,
}