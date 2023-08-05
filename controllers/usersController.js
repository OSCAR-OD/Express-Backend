const User = require('../models/User')
const Employee = require('../models/Employee')
const Team = require('../models/Team')
const bcrypt = require('bcrypt')
//const cloudinary = require("../utils/cloudinary");
const cloudinary = require('../utils/fileUploadCloudinary')
// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
    // Get all users from MongoDB
    const users = await User.find().select('-password').lean()

    // If no users 
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(users)
}

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
    const { name, email, password, roles } = req.body

    // Confirm data
    if (!name|| !email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ email }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate user email' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = (!Array.isArray(roles) || !roles.length)
        ? { name, email, "password": hashedPwd }
        : { name, email, "password": hashedPwd, roles }

    // Create and store new user 
    const user = await User.create(userObject)

    if (user) { //created 
        res.status(201).json({ message: `New user ${email} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
}

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
    const { id, name, email, roles, active, password } = req.body

    // Confirm data 
    if (!id || !name || !email || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    // Does the user exist to update?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate 
    const duplicate = await User.findOne({ email }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate useremail' })
    }

    user.name = name
    user.email = email
    user.roles = roles
    user.active = active

    if (password) {
        // Hash password 
        user.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.email} updated` })
}

////////////
//Profile
const getProfile = async (req, res) => {
    let loggedInUserId = req.user.id;
    let loggedInUserEmail = req.user.email;

    try {
        if (loggedInUserEmail.endsWith('@employee.ntech.com')) {
            foundUser = await Employee.findById(loggedInUserId)
            .select('-password').lean().exec();
        } else {
            foundUser = await User.findById(loggedInUserId)
            .select('-password').lean().exec();
        }
        // Find the user with the logged-in user ID
        if (!foundUser || !foundUser.active) {
            return res.status(401).json({ message: 'User Data not found' })
        }
       
        let { name, email, roles } = foundUser;
        let image = foundUser.image && foundUser.image.url ? foundUser.image.url : "https://icon-library.com/images/no-profile-picture-icon/no-profile-picture-icon-27.jpg";

      //  let image = foundUser.image.url || "https://icon-library.com/images/no-profile-picture-icon/no-profile-picture-icon-27.jpg"; 
     
        //let profileData = { name, email, roles, image };
       // res.json(foundUser);
       //  res.json(profileData);
       res.status(200).json({
        name,
        email,
        roles,
         image,
      });
     
      }catch (error) {
        console.log(error);
        res.status(500).send(error);
      }
}

////
// const getProfile = async (req, res) => {
//     const loggedInUserId = req.user.id;
//     const loggedInUserEmail = req.user.email;

//     try {
//         if (loggedInUserEmail.endsWith('@employee.ntech.com')) {
//             foundUser = await Employee.findById(loggedInUserId)
//             .select('-password').lean().exec();
//         } else {
//             foundUser = await User.findById(loggedInUserId)
//             .select('-password').lean().exec();
//         }
//         // Find the user with the logged-in user ID
//         if (!foundUser || !foundUser.active) {
//             return res.status(401).json({ message: 'User Data not found' })
//         }
//         res.json(foundUser);

//       }catch (error) {
//         console.log(error);
//         res.status(500).send(error);
//       }
// }

  // @desc Update own Profile
// @route PATCH /users
// @access Private

const updateProfile = async (req, res) => {
  //  const { id, name, email, image} = req.body
  let {name, image} = req.body
  
  try {
    // Confirm data 
// || !image
// if (!id || !name || !email || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
      
   if (!name || !image ) {
        return res.status(400).json({ message: 'All fields except password are required' })
    }
    let loggedInUserId = req.user.id;
    let loggedInUserEmail = req.user.email;
    let foundUser;
 if (loggedInUserEmail.endsWith('@employee.ntech.com')) {
            foundUser = await Employee.findById(loggedInUserId)
            .exec();
        } else {
            foundUser = await User.findById(loggedInUserId)
           .exec();
        }
    if (!foundUser) {
        return res.status(400).json({ message: 'User not Updated' })
    }
   foundUser.name = name
   // user.email = email
   // user.roles = roles
   // user.active = active
  
    // if (password) {
    //     // Hash password 
    //     user.password = await bcrypt.hash(password, 10) // salt rounds 
    // }
    let uploadedResponse;
    if(image && loggedInUserEmail.endsWith('@employee.ntech.com')){
       uploadedResponse = await cloudinary.uploader.upload(image, {
        upload_preset: "Employee",
        });  
    } else{
        uploadedResponse = await cloudinary.uploader.upload(image, {
            upload_preset: "User",
            });
    }
  if (uploadedResponse) {
    foundUser.image = {
        public_id: uploadedResponse.public_id,
        url: uploadedResponse.secure_url,
    };
   }

 const updatedUser = await foundUser.save();
 res.json({ message: `${updatedUser.email} Info updated` });
} catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    // Does the user still have assigned teams?
    const team = await Team.findOne({ user: id }).lean().exec()
    if (team) {
        return res.status(400).json({ message: 'User has assigned teams' })
    }

    // Does the user exist to delete?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.email} with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    getProfile,
    updateProfile,
    deleteUser
}