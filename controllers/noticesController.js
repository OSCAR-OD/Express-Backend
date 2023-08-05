const Notice = require('../models/Notice')
const Employee = require('../models/Employee')
const Team = require('../models/Team')

const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("../utils/fileUploadCloudinary");
//const cloudinary = require("cloudinary").v2;

// @desc Get all users
// @route GET /users
// @access Private
const getAllNotices = async (req, res) => {
    // Get all users from MongoDB
    const notices = await Notice.find();
    // If no notices 
    if (!notices?.length) {
        return res.status(400).json({ message: 'No notices found' })
    }
    const noticesWithEmployee = await Promise.all(teams.map(async (team) => {
      const employees = await Employee.find({ _id: { $in: team.members } }).lean().exec()
      const emails = employees.map(employee => employee.email)
      return { ...team, emails }
  }))
   

   res.json(noticesWithEmployee)
}
///
// const getNoticesForEmployee = async (req, res) => {
//   try {
//     // Assuming the logged-in user's ID is available in req.user.userId
//     const loggedInUserId = req.user.id;

//     const teams = await Team.find({ members: loggedInUserId }).lean().exec();

//     // Extract the team IDs from the teams found
//     const teamIds = teams.map(team => team._id);

//     // Find notices that have a matching team ID
//     const notices = await Notice.find({ teams: { $in: teamIds } })
//       .select('-desc -file')
//       .lean()
//       .exec();

//     const currentTime = new Date();

//     // Update isNew field based on the creation time
//     notices.forEach(notice => {
//       const creationTime = new Date(notice.createdAt);
//       const timeDifference = currentTime.getTime() - creationTime.getTime();
//       const noticeDuration =24 * 60 * 60 * 1000; // 1 day

//       if (timeDifference > noticeDuration) {
//         notice.isNew = false;
//         await Notice
//         .findByIdAndUpdate(
//           notice._id,
//           { isNew: false }
//         )
//         .exec();
//       }
//     });

//     res.json(notices);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Internal Server Error');
//   }
// };
///////
const getNoticesForEmployee = async (req, res) => {
  try {
    // Assuming the logged-in user's ID is available in req.user.userId
    const loggedInUserId = req.user.id;

    const teams = await Team.find({ members: loggedInUserId }).lean().exec();

    // Extract the team IDs from the teams found
    const teamIds = teams.map(team => team._id);

    // Find notices that have a matching team ID
    const notices = await Notice.find({ team: { $in: teamIds } })
    .select('-desc -file')
      .lean()
      .exec();

    const currentTime = new Date();

    // Update isNew field based on the creation time
    for (const notice of notices) {
      const creationTime = new Date(notice.createdAt);
      const timeDifference = currentTime.getTime() - creationTime.getTime();
      const noticeDuration = 24 * 60 * 60 * 1000; // 1 day

      if (notice.isNew && timeDifference > noticeDuration) {
        notice.isNew = false;
        await Notice.findByIdAndUpdate(notice._id, { isNew: false }).exec();
      }
    }

    res.json(notices);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};
////
//before making teams to team in notice
// const getNoticesForEmployee = async (req, res) => {
//   try {
//     // Assuming the logged-in user's ID is available in req.user.userId
//     const loggedInUserId = req.user.id;

//     const teams = await Team.find({ members: loggedInUserId }).lean().exec();

//     // Extract the team IDs from the teams found
//     const teamIds = teams.map(team => team._id);

//     // Find notices that have a matching team ID
//     const notices = await Notice.find({ teams: { $in: teamIds } })
//       .select('-desc -file')
//       .lean()
//       .exec();

//     const currentTime = new Date();

//     // Update isNew field based on the creation time
//     for (const notice of notices) {
//       const creationTime = new Date(notice.createdAt);
//       const timeDifference = currentTime.getTime() - creationTime.getTime();
//       const noticeDuration = 24 * 60 * 60 * 1000; // 1 day

//       if (notice.isNew && timeDifference > noticeDuration) {
//         notice.isNew = false;
//         await Notice.findByIdAndUpdate(notice._id, { isNew: false }).exec();
//       }
//     }

//     res.json(notices);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Internal Server Error');
//   }
// };
////
//good ok (not isNew)
// const getNoticesForEmployee = async (req, res) => {
//   try {
//     // Assuming the logged-in user's ID is available in req.user.userId
//     const loggedInUserId = req.user.id;

//     const teams = await Team.find({ members: loggedInUserId }).lean().exec();

//     // Extract the team IDs from the teams found
//     const teamIds = teams.map(team => team._id);

//     // Find notices that have a matching team ID
//     const notices = await Notice.find({ teams: { $in: teamIds } })
//     .select('-desc -file')
//     .lean().exec();
//     res.json(notices);
//   }catch (error) {
//     console.log(error);
//     res.status(500).send('Internal Server Error');
//   }
// };

////
// const markNoticeAsViewed = async (req, res) => {
//   try {
//     const noticeId = req.params?.noticeId;
//     console.log("noticeId",noticeId);

//     // Find the notice by ID
//     const notice = await Notice.findById(noticeId).exec();

//     if (!notice) {
//       return res.status(404).json({ message: 'Notice not found' });
//     }

//     // Update the isNew field to false
//     notice.isNew = false;
//     await notice.save();
//    console.log("notice",notice);
//     res.json(notice);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Internal Server Error');
//   }
// };
/////////////
// const getNoticesForEmployee = async (req, res) => {
//   try {
//     // Assuming the logged-in user's ID is available in req.user.userId
//     const loggedInUserId = req.user.id;

//     const teams = await Team.find({ members: loggedInUserId }).lean().exec();

//     // Extract the team IDs from the teams found
//     const teamIds = teams.map(team => team._id);

//     // Find notices that have a matching team ID
//     const notices = await Notice.find({ teams: { $in: teamIds } })
//       .select('-desc -file')
//       .lean()
//       .exec();

//     const updatedNotices = notices.map(notice => {
//       // Check if the notice has been seen by the user
//       const isSeen = notice.seenBy.includes(loggedInUserId);
//       // Update the isNew status based on the seen status
//       const isNew = !isSeen;
//       // Return the updated notice object
//       return { ...notice, isNew };
//     });

//     const newNotices = updatedNotices.filter(notice => notice.isNew);
//     const newNoticeCount = newNotices.length;
// console.log("notices", notices);
// console.log("newNoticeCount", newNoticeCount);

//     res.json({ notices: updatedNotices, newNoticeCount });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Internal Server Error');
//   }
// };
//@desc Create new user
//@route POST /users
//@access Private
//vvvvv gdd

// const createNewNotice = async (req, res) => {
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
//         const product = new Notice({
//           name,
//           brand,
//           desc,
//           price,
//           image: uploadedResponse,
//         });

//         const savedNotice = await product.save();
//         res.status(200).send(savedNotice);
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error);
//   }
// }

////////////////////////
const createNewNotice = async (req, res) => {
  const { title, desc,team } = req.body;
  //const { name, brand, desc, price } = req.body;
  const fileData = req.body.file;
   try {
    const uploadedResponse = await cloudinary.uploader.upload(fileData, {
         upload_preset: "Notice",
       });
       if (uploadedResponse) {
        const notice = new Notice({
          title,
          desc,
          file: {
            public_id: uploadedResponse.public_id,
            url: uploadedResponse.secure_url,
          },
          team,
        });
        const savedNotice = await notice.save();
        res.status(200).send(savedNotice);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  };
/////////////////

//@desc Update a user
//@route PATCH /users
//@access Private

// const createNewNotice = async (req, res) => {
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
//     const product = await Notice.create({
//          name,
//          brand,
//          desc,
//          price,
//          image: fileData,
//        });

//        //const savedNotice = await product.save();
//        res.status(200).send(product);
 

// //  } catch (error) {
// //    console.log(error);
// //    res.status(500).send(error);
// //  }
//    // const product = await Notice.create1({
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
//    // const duplicate = await Notice.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

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
    getAllNotices,
    getNoticesForEmployee,
    createNewNotice,
   // markNoticeAsViewed,
    updateUser,
    deleteUser
}