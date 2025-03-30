import e from 'express'// default 
import {  ownersignup,ownerLogin,ownerProfile,ownerProfileUpdate,ownerLogout,checkOwner,deleteOwner,deactivateOwner,forgetPassword,changePassword,resetPassword} from '../controllers/ownerControllers.js';
//import{authUser} from '../middlewares/authUser.js'
 import { authAdmin } from '../middlewares/authAdmin.js';
 import { authOwner } from '../middlewares/authOwner.js';
const router = e.Router();

//signup
router.post("/signup",ownersignup)
//login
router.put("/login",ownerLogin)


//profile fetch
router.get("/profile",authOwner,ownerProfile)
//profile edit
router.put("/update",authOwner,ownerProfileUpdate)
//logout
router.get("/logout",ownerLogout)

// check owner auth
router.put("/checkowner", authOwner , checkOwner);
//delete account
router.delete("/deleteAccount",authOwner,deleteOwner)
//profile_deactivate
router.put("/deactivate-owner/:ownerId",authOwner, deactivateOwner );

//forgot password
router.post("/forgot-password", forgetPassword);
//password change
router.put("/change-password", authOwner, changePassword);
//reset password
router.post("/reset-password",resetPassword)
// Make sure this route is properly defined*/

export {router as ownerRouter}