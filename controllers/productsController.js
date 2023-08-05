const Product = require('../models/Product')
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("../utils/fileUploadCloudinary");
//const cloudinary = require("cloudinary").v2;

// @desc Get all users
// @route GET /users
// @access Private
const getAllProducts = async (req, res) => {
    // Get all users from MongoDB
    const products = await Product.find();
    // If no products 
    if (!products?.length) {
        return res.status(400).json({ message: 'No products found' })
    }
  res.json(products)
}

//@desc Create new user
//@route POST /users
//@access Private
//vvvvv gdd

// const createNewProduct = async (req, res) => {
//  const { name, brand, desc, price, image } = req.body;
//  //const { name, brand, desc, price } = req.body;

//   try {
//     //let fileData = {};
//     console.log('Up');
//     console.log('details', req.file);
//     console.log('name', name);
    
//       // if (req.file) {
//       //   console.log('going');
//   if (image) {
//           // Save image to cloudinary
//    // let uploadedFile;
//       const uploadedResponse = await cloudinary.uploader.upload(image, {
//         upload_preset: "User",
//       });

//       if (uploadedResponse) {
//         const product = new Product({
//           name,
//           brand,
//           desc,
//           price,
//           image: uploadedResponse,
//         });

//         const savedProduct = await product.save();
//         res.status(200).send(savedProduct);
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error);
//   }
// }

////////////////////////
const createNewProduct = async (req, res) => {
  const { name, brand, desc, price, image } = req.body;
  //const { name, brand, desc, price } = req.body;
 
   try {
     //let fileData = {};
    // console.log('Up');
     //console.log('details', req.file);
     //console.log('name', name);
     
      // if (req.file) {
        // console.log('going');
   //if (image) {
           // Save image to cloudinary
    // let uploadedFile;
       const uploadedResponse = await cloudinary.uploader.upload(image, {
         upload_preset: "User",
       });
 
       if (uploadedResponse) {
         const product = new Product({
           name,
           brand,
           desc,
           price,
           image:  {
            public_id: uploadedResponse.public_id,
            url: uploadedResponse.secure_url
        }
      });
 
         const savedProduct = await product.save();
         res.status(200).send(savedProduct);
       }
   
   } catch (error) {
     console.log(error);
     res.status(500).send(error);
   }
   
 }
/////////////////

//@desc Update a user
//@route PATCH /users
//@access Private

// const createNewProduct = async (req, res) => {
//   // const { name, brand, desc, price, image } = req.body;
// const { name, brand, desc, price } = req.body;

// if (!name || !brand || !desc || !price) {
//   res.status(400);
//   throw new Error("Please fill in all fields");
// }

//    let fileData = {};
//    if (req.file) {

//     let uploadedFile;
//   try{
//    // const uploadedResponse = await cloudinary.uploader.upload(image, {
//      //  upload_preset: "User",
//      //req.file.path
//      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
//         upload_preset: "User",
//         //  folder: "Pinvent App",
//       resource_type: "image",
//       });
//     } catch (error) {
//       res.status(500);
//       throw new Error("Image could not be uploaded");
//     }
//     fileData = {
//       fileName: req.file.originalname||'oscar',
//       filePath: uploadedFile.secure_url,
//       fileType: req.file.mimetype,
//       fileSize: fileSizeFormatter(req.file.size, 2),
//     };
//   }
//     const product = await Product.create({
//          name,
//          brand,
//          desc,
//          price,
//          image: fileData,
//        });

//        //const savedProduct = await product.save();
//        res.status(200).send(product);
 

// //  } catch (error) {
// //    console.log(error);
// //    res.status(500).send(error);
// //  }
//    // const product = await Product.create1({
//    //     image,
//    //     title,
//    //     price,
//    //     category,
//    //     description
//    // })
//    // const { username, password, roles } = req.body

//    // // Confirm data
//    // if (!username || !password) {
//    //     return res.status(400).json({ message: 'All fields are required' })
//    // }

//    // // Check for duplicate username
//    // const duplicate = await Product.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

//    // if (duplicate) {
//    //     return res.status(409).json({ message: 'Duplicate username' })
//    // }

//    // // Hash password 
//    // const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

//    // const userObject = (!Array.isArray(roles) || !roles.length)
//    //     ? { username, "password": hashedPwd }
//    //     : { username, "password": hashedPwd, roles }

//    // // Create and store new user 
//    // const user = await User.create(userObject)

//    // if (user) { //created 
//    //     res.status(201).json({ message: `New user ${username} created` })
//    // } else {
//    //     res.status(400).json({ message: 'Invalid user data received' })
//    // }
// }

const updateUser = async (req, res) => {
    const { id, username, roles, active, password } = req.body

    // Confirm data 
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    // Does the user exist to update?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate 
    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
        // Hash password 
        user.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
}

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    // Does the user still have assigned notes?
    const note = await Note.findOne({ user: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' })
    }

    // Does the user exist to delete?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllProducts,
    createNewProduct,
    updateUser,
    deleteUser
}