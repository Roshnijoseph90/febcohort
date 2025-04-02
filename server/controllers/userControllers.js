// Correct import for bcryptjs
import bcrypt from 'bcryptjs';

import { generateToken } from '../utils/token.js';
import { User } from '../models/usersModel.js';
import crypto from 'crypto'
const NODE_ENV = process.env.NODE_ENV;


import mongoose from 'mongoose';  
export const usersignup = async (req, res, next) => {
  try {
    console.log('signup hitted');

    // Collect user data
    const { name, email, mobile, location, profile_pic, password, confirmPassword } = req.body;

    if (!name || !email || !mobile || !location || !profile_pic || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log(name, email);

    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Compare password with confirm password
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash the password
    const hashedPassword =  bcrypt.hashSync(password, 10); // Changed to async version

    // Save to the database
    const newUser = new User({ name, email, mobile, location, password: hashedPassword, profile_pic });
    await newUser.save();

    // Generate token using ID and role
    const token = generateToken(newUser._id, "user");

    res.cookie("token", token) // Store token in a cookie
   /*res.cookie("token", token, 
    { httpOnly: true, secure: false, sameSite: 'lax' });*/


    console.log('Token generated and sent');

    
    res.json({
      data:  newUser,
     
      message: "Signup successful"
    });
  
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    console.log(error);
  }
};


export const userLogin= async (req, res, next) => {
  try {
    
    //collect userdata
    const {  email,password,confirmPassword} = req.body;

    if ( !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
   
    //user exists
    const userExist = await User.findOne({email})
    if(!userExist){
      return res.status(404).json({message:"user not found"})
    }
    //console.log('Stored password hash:', userExist.password);
    //password match compare
    ;
    const passwordMatch =  bcrypt.compareSync(password, userExist.password);

    if(!passwordMatch){

      return res.status(401).json({messsage:"invalid credentials"})

    }
    if(!userExist.isActive){
      return res.status(401).json({message:"user account is not active"})
    }
    //generate token
    const token = generateToken(userExist._id, "user");
    //res.cookie("token",token)
    //store token
    res.cookie("token", token, {
      sameSite: NODE_ENV === "production" ? "None" : "Lax",
      secure: NODE_ENV === "production",
      httpOnly: NODE_ENV === "production",
    });
   delete userExist._doc.password
    
      res.json({ data: userExist, message: "login successful" })
    
    } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    console.log(error);
  }
}
// user profile fetch
export const userProfile = async (req, res, next) => {
  try {
     //userId
     const userId = req.user.id;
     console.log('userId:', userId);
     const userData = await User.findById(userId).select("-password")
     res.json({data:userData,message:"user profile fetched"})
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    console.log(error);
  }
}
export const userProfileUpdate = async (req, res, next) => {
  try {
     //userId
     const { name, email, mobile, location, profile_pic, password, confirmPassword }= req.body
     const userId = req.user.id;
     const userData = await User.findByIdAndUpdate(userId,{ name, email, mobile, location, profile_pic, password, confirmPassword },{new:true})
     res.json({data:userData,message:"user updated"})
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    console.log(error);
  }
}
export const userLogout = async (req, res, next) => {
  try {
    res.clearCookie("token")
      
     res.json({message:"user logout sucessfully"})
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    console.log(error);
  }
}


export const checkUser = async (req, res, next) => {
  try {
    
    res.json({ message: "user authorized" });
  } catch (error) {
    
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    console.log(error);
  }
};




export const deactivateUser = async (req, res, next) => {
  try {
    let userId = req.params.userId;
  
    
    // Check if the userId is a valid 24-character hexadecimal string
    /*if (!/^[a-fA-F0-9]{24}$/.test(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }*/

    const objectId = new mongoose.Types.ObjectId(userId);  // Convert to ObjectId
    console.log("Converted ObjectId:", objectId)

    const user = await User.findById(objectId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = false;
    await user.save();
    res.json({ data:user,message: "User account deactivated successfully" });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
  }
};
export const deleteUser = async (req, res, next) => {
  try {
    console.log('Authenticated User:', req.user); 

    if (!req.user) {
      return res.status(401).json({ message: 'User is not authenticated' });
    }
    const userId = req.user.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    console.log(error);
  }
};

export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    console.log("User with reset token:", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour
    console.log("User object before saving:", user);

    await user.save();
    const updatedUser = await User.findOne({ email: user.email });
   console.log("Updated user after saving:", updatedUser);

    // Send the reset token in the response (you can also return a message for the user to manually call the reset API)
    res.json({ 
      message: "Password reset request received",
      resetToken: resetToken, // Return the token directly
    });
  } catch (error) {
    
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    console.log(error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: "Reset token and new password are required" });
    }

    console.log("Received Reset Token:", resetToken);

    // Find the user by the reset token
    const user = await User.findOne({ resetToken });
    if (!user) {
      console.log("No user found with reset token:", resetToken);
      return res.status(400).json({ message: "Invalid reset token" });
    }

    // Log user data to verify
    console.log("User found with reset token:", user);

    // Check if the reset token has expired
    if (user.resetTokenExpiration < Date.now()) {
      console.log("Reset token has expired. Expiration time:", user.resetTokenExpiration);
      return res.status(400).json({ message: "Expired reset token" });
    }

    // Proceed with password reset
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = undefined; // Clear the reset token after use
    user.resetTokenExpiration = undefined; // Clear the expiration time after reset

    await user.save();

    res.json({ message: "Password has been successfully reset" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};


export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // Assume the user is authenticated and `req.user.id` is available

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the current password is correct
    const passwordMatch = bcrypt.compareSync(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password has been successfully changed" });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal server error' });
    console.log(error);
  }
};

