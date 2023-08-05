const User = require('../models/User')
const Employee = require('../models/Employee')
const Token = require("../models/tokenModel");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
//const sendEmail = require("../utils/sendEmailMG");
const sendEmail = require("../utils/sendEmailMG");
const crypto = require("crypto");
const allowedOrigins = require('../config/allowedOrigins');
//const dotenv = require('dotenv');
//dotenv.config();
// @desc Login
// @route POST /auth
// @access Public
////v gd
// const login = async (req, res) => {
//     const { email, password } = req.body

//     if (!email || !password) {
//         return res.status(400).json({ message: 'All fields are required' })
//     }

//     const foundUser = await User.findOne({ email }).exec()

//     if (!foundUser || !foundUser.active) {
//         return res.status(401).json({ message: 'Unauthorized' })
//     }

//     const match = await bcrypt.compare(password, foundUser.password)

//     if (!match) return res.status(401).json({ message: 'Unauthorized' })

//     const accessToken = jwt.sign(
//         {
//             "UserInfo": {
//               "id": foundUser._id,
//               "email": foundUser.email,
//               "roles": foundUser.roles
//             }
//         },
//         process.env.ACCESS_TOKEN_SECRET,
//         { expiresIn: '15m' }
//     )

//     const refreshToken = jwt.sign(
//         { "email": foundUser.email },
//         process.env.REFRESH_TOKEN_SECRET,
//         { expiresIn: '7d' }
//     )

//     // Create secure cookie with refresh token 
//     res.cookie('jwt', refreshToken, {
//         httpOnly: true, //accessible only by web server 
//         secure: true, //https
//         sameSite: 'None', //cross-site cookie 
//         maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
//     })

//     // Send accessToken containing username and roles 
//     res.json({ accessToken })
// }
////////////
const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    let foundUser;
//'@employee.ntech.com' or '@ntech.com' 
 
if (email.endsWith('@employee.ntech.com')) {
 
        foundUser = await Employee.findOne({ email }).exec();
    } else {
        foundUser = await User.findOne({ email }).exec();
    }

    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const accessToken = jwt.sign(
        {
            "UserInfo": {
              "id": foundUser._id,
              "email": foundUser.email,
              "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        { "email": foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'None', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    // Send accessToken containing username and roles 
    res.json({ accessToken })
}

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            let foundUser;

            if (decoded.email.endsWith('@employee.ntech.com')) {
              foundUser = await Employee.findOne({ email: decoded.email }).exec()
          } else {
              foundUser = await User.findOne({ email: decoded.email }).exec()
          }
          if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                      "id": foundUser._id, 
                      "email": foundUser.email,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        }
    )
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

const register = async (req, res) => {
    const { name, email, password } = req.body;
    if ( !name || !email || !password) 
    return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ email }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedpassword = await bcrypt.hash(password, 10);

        //create and store the new user
        const result = await User.create({
            "name": name,
            "email": email,
            "password": hashedpassword
        });

       // console.log(result);

        res.status(201).json({ 'success': `New user ${email} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email }).exec();
  
    if (!user) {
      res.status(404);
      throw new Error("User does not exist");
    }
  // Delete token if it exists in DB
    let token = await Token.findOne({ userId: user._id });
    if (token) {
      await token.deleteOne();
   }
  
    // Create Reste Token
    let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
    //console.log(resetToken);
  
    // Hash token before saving to DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
       // Save Token to DB
    await new Token({
      userId: user._id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * (60 * 1000), // Thirty minutes
       }).save();
  
    // Construct Reset Url
 const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    resetUrl = `${origin}/resetPassword/${resetToken}`;
  // resetUrl = `abc/resetpassword/${resetToken}`;
 
  } else {
    res.status(500).json({ 'message': 'Error occured' });
   // resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
  }
    // Reset Email
    const message = 
    `    <h2>Hello ${user.name}</h2>
        <p>Please use the url below to reset your password</p>  
        <p>This reset link is valid for only 30minutes.</p>
  
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
  
        <p>Regards...</p>
        <p>Netri Team</p>nv.EMAIL_USER;
      `;
    const subject = "Password Reset Request";
     //const send_to = 'oscardeb2000@gmail.com';
   
     const send_to = user.email;
   const sent_from = 'Oscar@employee.ntech.com';
  
  try {
    console.log(resetUrl);
     // await sendEmail(subject, message, send_to, sent_from);
      res.status(200).json({ success: true, message: "Reset Email Sent" });

    } catch (error) {
      res.status(500);
      throw new Error("Email not sent, please try again");
   
    }
  };

  const resetPassword = async (req, res) => {
    const { password } = req.body;
    const { resetToken } = req.params;
  
    // Hash token, then compare to Token in DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    // fIND tOKEN in DB
    const userToken = await Token.findOne({
      token: hashedToken,
      expiresAt: { $gt: Date.now() },
    });
  
    if (!userToken) {
      res.status(404);
      throw new Error("Invalid or Expired Token");
    }
  
    // Find user
    const user = await User.findOne({ _id: userToken.userId });
    try {
      //encrypt the password
      const hashedpassword = await bcrypt.hash(password, 10);
       user.password =  hashedpassword
       await user.save();
      res.status(201).json({ 'success': 'Password Reset Successful, Please Login' });
  } catch (err) {
      res.status(500).json({ 'message': err.message });
  }
    //user.password = password;
    //await user.save();
    // res.status(200).json({
    //   message: "Password Reset Successful, Please Login",
    // });
  };


module.exports = {
    login,
    refresh,
    logout,
    register,
    forgotPassword,
    resetPassword,
}