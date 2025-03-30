import e from 'express'// default 
import { userLogin, usersignup,userProfile ,userProfileUpdate, userLogout,checkUser,deactivateUser,forgetPassword,changePassword,resetPassword,deleteUser} from '../controllers/userControllers.js';
import{authUser} from '../middlewares/authUser.js'
import { authAdmin } from '../middlewares/authAdmin.js';

const router = e.Router();

//signup
router.post("/signup",usersignup)
//login
router.put("/login",userLogin)


//profile fetch
router.get("/profile",authUser,userProfile)
//profile edit
router.put("/update",authUser,userProfileUpdate)
//logout
router.get("/logout",userLogout)
//delete account
router.delete("/deleteAccount",authUser,deleteUser)
// check user auth
router.get("/checkuser", authUser, checkUser);
//profile_deactivate
router.put("/deactivate-user/:userId",authUser, deactivateUser );

//forgot password
router.post("/forgot-password", forgetPassword);
//password change
router.put("/change-password", authUser, changePassword);
//reset password
router.post("/reset-password",resetPassword)
// Make sure this route is properly defined

export {router as userRouter}
