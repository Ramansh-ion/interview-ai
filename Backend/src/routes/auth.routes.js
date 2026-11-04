import {Router} from "express";
import {registerUserController, loginUserController, logoutUserController,getMeController} from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
const authRouter = Router();
/**
 * @route POST /api/auth/register
 * @description register a new user expects user 
 * @access public
 */

authRouter.post('/register', registerUserController);



/**
 * @route POST /api/auth/login
 * @description register a new user expects user 
 * @access public
 */

authRouter.post('/login', loginUserController);


/**
 * @route GET /api/auth/logout
 * @description clear token  a user expects user 
 * @access public
 */

authRouter.get('/logout', logoutUserController);


/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */

authRouter.get('/get-me',authUser, getMeController);

export default authRouter;