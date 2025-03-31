import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/token.js';
import {Admin} from '../models/adminModel.js'
import crypto from 'crypto'
import mongoose from 'mongoose'; 
const NODE_ENV = process.env.NODE_ENV;


export const adminsignup = async (req, res, next) => {
  try {
    console.log('signup hitted');

    // Collect admin data
    const { name, email, mobile,  password, confirmPassword } = req.body;

    if (!name || !email || !mobile || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log(name, email);

    // Check if admin already exists
    const adminExist = await Admin.findOne({ email });
    if (adminExist) {
      return res.status(400).json({ message: "admin already exists" });
    }

    // Compare password with confirm password
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash the password
    const hashedPassword =  bcrypt.hashSync(password, 10); // Changed to async version

    // Save to the database
    const newAdmin = new Admin({ name, email, mobile, password: hashedPassword });
    await newAdmin.save();

    // Generate token using ID and role
    const token = generateToken(newAdmin._id, "admin");

    res.cookie("token", token);  // Store token in a cookie

    console.log('Token generated and sent');

    
    res.json({
      data:  newAdmin,
     
      message: "Signup successful"
    });
  
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    console.log(error);
  }
};


export const adminLogin= async (req, res, next) => {
  try {
    //collect admindata
    const {  email,password,confirmPassword} = req.body;

    if ( !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
   
    //admin exists
    const adminExist = await Admin.findOne({email})
    if(!adminExist){
      return res.status(404).json({message:"admin not found"})
    }
    
    //password match compare
    
    const passwordMatch =  bcrypt.compareSync(password, adminExist.password);

    if(!passwordMatch){

      return res.status(401).json({messsage:"invalid credentials"})

    }
    if(!adminExist.isActive){
      return res.status(401).json({message:"admin account is not active"})
    }
    //generate token
    const token = generateToken(adminExist._id,adminExist.role || "admin");
    res.cookie("token", token, 
      { httpOnly: true, secure: false, sameSite: 'lax' });

    delete adminExist._doc.password
    
      res.json({ data: adminExist, message: "login successful" })
    
    } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    console.log(error);
  }
}
// admin profile fetch
export const adminProfile = async (req, res, next) => {
  try {
     //ownerId
     const adminId = req.admin.id;
     const adminData = await Admin.findById(adminId)
     res.json({data:adminData,message:"admin profile fetched"})
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    console.log(error);
  }
}
export const adminProfileUpdate = async (req, res, next) => {
  try {
     //ownerId
    const {name, email, mobile, password,confirmPassword }= req.body
     const adminId = req.admin.id;
     const adminData = await Admin.findByIdAndUpdate(adminId,{name, email, mobile, password, confirmPassword },{new:true})
     res.json({data:adminData,message:"admin updated"})
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    console.log(error);
  }
}
export const adminLogout = async (req, res, next) => {
  try {
    res.clearCookie("token")
      
     res.json({message:"admin logout sucessfully"})
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    console.log(error);
  }
}
export const checkAdmin = async (req, res, next) => {
  try {
    
    res.json({ message: "admin authorized" });
  } catch (error) {
    
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    console.log(error);
  }
};


export const deactivateAdmin = async (req, res, next) => {
  try {
    let adminId = req.params.adminId;
   
    const objectId = new mongoose.Types.ObjectId(adminId);  // Convert to ObjectId
    console.log("Converted ObjectId:", objectId);

    const admin = await Admin.findById(objectId);
    if (!admin) {
      return res.status(404).json({ message: "Owner not found" });
    }

    admin.isActive = false;
    await admin.save();
    res.json({ message: "Admin account deactivated successfully" });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
  }
};
export const deleteAdmin= async (req, res, next) => {
  try {
    
  if (!req.admin) {
      return res.status(401).json({ message: 'admin is not authenticated' });
    }
    const adminId = req.admin.id;
    const admin = await Admin.findByIdAndDelete(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ data:admin,message: "Account deleted successfully" });
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

    const admin = await Admin.findOne({ email });
    console.log("User with reset token:", admin);
    if (!admin) {
      return res.status(404).json({ message: "admin not found" });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    admin.resetToken = resetToken;
    admin.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour
    console.log("User object before saving:", admin);

    await admin.save();
    const updatedAdmin = await Admin.findOne({ email: admin.email });
   console.log("Updated admin after saving:", updatedAdmin);

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
    const admin = await Admin.findOne({ resetToken });
    if (!admin) {
      console.log("No admin found with reset token:", resetToken);
      return res.status(400).json({ message: "Invalid reset token" });
    }

    // Log user data to verify
    console.log("Admin found with reset token:", admin);

    // Check if the reset token has expired
    if (admin.resetTokenExpiration < Date.now()) {
      console.log("Reset token has expired. Expiration time:", admin.resetTokenExpiration);
      return res.status(400).json({ message: "Expired reset token" });
    }

    // Proceed with password reset
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    admin.password = hashedPassword;
    admin.resetToken = undefined; // Clear the reset token after use
    admin.resetTokenExpiration = undefined; // Clear the expiration time after reset

    await admin.save();

    res.json({ message: "Password has been successfully reset" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin.id; 

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    // Find the admin by ID
    const admin= await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "admin not found" });
    }

    // Check if the current password is correct
    const passwordMatch = bcrypt.compareSync(currentPassword, admin.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // Update the user's password
    admin.password = hashedPassword;
    await admin.save();

    res.json({ message: "Password has been successfully changed" });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal server error' });
    console.log(error);
  }
};


