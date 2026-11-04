import { UserModel } from "../modals/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {BlacklistModel} from "../modals/blacklist.model.js";
/**
 * @name registerUserController
 * @description register a new user expects username, email and password in the request body 
 * @access public
 
*/
export const registerUserController= async (req,res)=>{
    const {username,email,password} = req.body;
    if(!username || !email || !password){
        return res.status(400).json({message:'Please provide username,email and password'})
    }
    const isUserAlreadyExists = await UserModel.findOne({$or:[{username},{email}]})
    if(isUserAlreadyExists){
        return res.status(400).json({message:'User already exists'})
    }
    const hash = await bcrypt.hash(password,10)
    const user = await UserModel.create({
        username,
        email,
        password:hash}
    )
    const token = jwt.sign({
        id:user._id,
        username:user.username
    }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token);

    res.status(201).json({
        message:'User registered successfully',
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })

}

/**
 * @name loginUserController
 * @description login a user expects email and password in the request body
 * @access public
 */

export const loginUserController = async (req,res)=>{
    const {email,password} = req.body;
    const user = await UserModel.findOne({email})
    if(!user){
        return res.status(400).json({message:'Invalid email or password'})
    }
    
        const isPasswordValid = await bcrypt.compare(password,user.password)
        if(!isPasswordValid){
            return res.status(400).json({message:'Invalid email or password'})
        }
        const token = jwt.sign({
            id:user._id,
            username:user.username
        }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token);
        res.status(200).json({
            message:'User logged in successfully',
            user:{
                id:user._id,
                username:user.username,
                email:user.email
            }
        })  
    
}

/**
 * @name logoutUserController
 * @description clear token from the cookie and add the token to blacklist 
 * @access public
 */

 
export const logoutUserController = async (req,res)=>{
    const token = req.cookies.token;

    if (token){
        await BlacklistModel.create({token})
    }
    res.clearCookie('token');
    res.status(200).json({message:'User logged out successfully'})
}

/**
 * @name geMeController
 * @description get the current logged in user details
 * @access private
 */
export const getMeController = async (req,res)=>{
    const user = await UserModel.findById(req.user.id)

    res.status(200).json({
        message:"User details fetched successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }   
    })


}