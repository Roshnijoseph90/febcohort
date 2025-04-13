
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/token.js';
import {Owner} from '../models/ownerModels.js'
import mongoose from 'mongoose';  
const NODE_ENV = process.env.NODE_ENV;

export const ownersignup = async (req, res, next) => {
  try {
    console.log('signup hitted');

    const { name, email, mobile,  password, confirmPassword } = req.body;

    if (!name || !email || !mobile || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log(name, email);

    // Check if user already exists
    const ownerExist = await Owner.findOne({ email });
    if (ownerExist) {
      return res.status(400).json({ message: "owner already exists" });
    }

    // Compare password with confirm password
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash the password
    const hashedPassword =  bcrypt.hashSync(password, 10); // Changed to async version

   const newOwner = new Owner({ name, email, mobile, password: hashedPassword });
    await newOwner.save();

    // Generate token using ID and role
    const token = generateToken(newOwner._id, "owner");

    res.cookie("token", token);  // Store token in a cookie
   res.json({data:  newOwner,message: "Signup successful"});
  
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    console.log(error);
  }
};


export const ownerLogin= async (req, res, next) => {
  try {
    //collect ownerrdata
    const {  email,password,confirmPassword} = req.body;

    if ( !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
   
    //owner exists
    const ownerExist = await Owner.findOne({email})
    if(!ownerExist){
      return res.status(404).json({message:"owner not found"})
    }
    
    const passwordMatch =  bcrypt.compareSync(password, ownerExist.password);

    if(!passwordMatch){

      return res.status(401).json({messsage:"invalid credentials"})

    }
    if(!ownerExist.isActive){
      return res.status(401).json({message:"owner account is not active"})
    }
    //generate token
    const token = generateToken(ownerExist._id,ownerExist.role || "owner");
    //res.cookie("token", token)
    res.cookie("token", token, 
      { httpOnly: true, secure: false, sameSite: 'lax' });
   delete ownerExist._doc.password
    
      res.json({ data: ownerExist, message: "login successful" })
    
    } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    console.log(error);
  }
}
// owner profile fetch
export const ownerProfile = async (req, res, next) => {
  try {
     //adminId
     const ownerId = req.owner.id;
     const ownerData = await Owner.findById(ownerId)
     res.json({data:ownerData,message:"owner profile fetched"})
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    console.log(error);
  }
}
export const ownerProfileUpdate = async (req, res, next) => {
  try {
     //ownerId
    const {name, email, mobile, theaters, password, confirmPassword }= req.body
     const ownerId = req.owner.id;
     const ownerData = await Owner.findByIdAndUpdate(ownerId,{name, email, mobile, theaters, password, confirmPassword },{new:true})
     res.json({data:ownerData,message:"owner updated"})
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    console.log(error);
  }
}
export const ownerLogout = async (req, res, next) => {
  try {
    res.clearCookie("token")
      
     res.json({message:"owner logout sucessfully"})
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    console.log(error);
  }
}


export const checkOwner = async (req, res, next) => {
  try {
    
    res.json({ message: "owner authorized" });
  } catch (error) {
    
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    console.log(error);
  }
};

export const deactivateOwner = async (req, res, next) => {
  try {
    let ownerId = req.params.ownerId;
    
    const objectId = new mongoose.Types.ObjectId(ownerId);  
    console.log("Converted ObjectId:", objectId);

    const owner = await Owner.findById(objectId);
    if (!owner) {
      return res.status(404).json({ message: "owner not found" });
    }

    owner.isActive = false;
    await owner.save();
    res.json({data:owner, message: "owner account deactivated successfully" });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
  }
};
export const deleteOwner = async (req, res, next) => {
  try {
    console.log('Authenticated owner:', req.user); 

    if (!req.owner) {
      return res.status(401).json({ message: 'owner is not authenticated' });
    }
    const ownerId = req.owner.id;
    const owner = await Owner.findByIdAndDelete(ownerId);

    if (!owner) {
      return res.status(404).json({ message: "owner not found" });
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

    const owner = await Owner.findOne({ email });
    console.log("Owner with reset token:", owner);
    if (!owner) {
      return res.status(404).json({ message: "owner not found" });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    owner.resetToken = resetToken;
    owner.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour
    console.log("owner object before saving:", owner);

    await owner.save();
    const updatedOwner = await Owner.findOne({ email: owner.email });
   console.log("Updated owner after saving:", updatedOwner);

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

    // Find the owner by the reset token
    const owner = await Owner.findOne({ resetToken });
    if (!owner) {
      console.log("No owner found with reset token:", resetToken);
      return res.status(400).json({ message: "Invalid reset token" });
    }

    // Log owner data to verify
    console.log("owner found with reset token:", owner);

    // Check if the reset token has expired
    if (owner.resetTokenExpiration < Date.now()) {
      console.log("Reset token has expired. Expiration time:", owner.resetTokenExpiration);
      return res.status(400).json({ message: "Expired reset token" });
    }

    // Proceed with password reset
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    owner.password = hashedPassword;
    owner.resetToken = undefined; // Clear the reset token after use
    owner.resetTokenExpiration = undefined; // Clear the expiration time after reset

    await owner.save();

    res.json({ message: "Password has been successfully reset" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};


export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const ownerId = req.owner.id; 

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    // Find the user by ID
    const owner = await Owner.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ message: "owner not found" });
    }

    // Check if the current password is correct
    const passwordMatch = bcrypt.compareSync(currentPassword, owner.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // Update the owner's password
    owner.password = hashedPassword;
    await owner.save();

    res.json({ message: "Password has been successfully changed" });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal server error' });
    console.log(error);
  }
};

