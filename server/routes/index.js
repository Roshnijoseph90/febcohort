import e from "express"
import {userRouter} from './userRoutes.js'
import {ownerRouter} from './ownerRoutes.js'
import { adminRouter } from "./adminRoutes.js"
import {movieRouter} from './movieRoutes.js'
import {reviewRouter} from './reviewRoutes.js'
import { theaterRouter } from './theaterRoutes.js'
import { showRouter } from "./showsRoutes.js"
import { bookingRouter } from "./bookingRoutes.js"
import { ticketRouter } from "./ticketRoutes.js"
const router = e.Router()
router.use("/user",userRouter)
router.use("/owner",ownerRouter)
router.use("/admin",adminRouter)
router.use("/movie",movieRouter)
router.use("/review",reviewRouter)
router.use("/theater",theaterRouter)
router.use("/shows",showRouter)
router.use("/booking",bookingRouter)
router.use("/ticket",ticketRouter)


export {router as apiRouter}