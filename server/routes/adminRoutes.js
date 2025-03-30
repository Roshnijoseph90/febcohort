import e from 'express'// default 
import {  adminsignup,adminLogin,adminProfile,adminProfileUpdate,adminLogout, deleteAdmin, checkAdmin, deactivateAdmin,forgetPassword,changePassword,resetPassword} from '../controllers/adminControllers.js';
//import{authUser} from '../middlewares/authUser.js'
 import { authAdmin } from '../middlewares/authAdmin.js';
 import { authOwner } from '../middlewares/authOwner.js';
const router = e.Router();

//signup
router.post("/signup",adminsignup)
//login
router.put("/login",adminLogin)


//profile fetch
router.get("/profile",authAdmin,adminProfile)
//profile edit
router.put("/update",authAdmin,adminProfileUpdate)
//logout
router.get("/logout",adminLogout)
//delete account
router.delete("/deleteAccount",authAdmin,deleteAdmin)
// check owner auth
router.put("/checkadmin", authAdmin , checkAdmin);
//profile_deactivate
router.put("/deactivate-admin/:adminId", deactivateAdmin, authAdmin);

//forgot password
router.post("/forgot-password", forgetPassword);
//password change
router.put("/change-password", authAdmin, changePassword);
//reset password
router.post("/reset-password",resetPassword)
// Make sure this route is properly defined*/

export {router as adminRouter}