import jwt from 'jsonwebtoken';
import { BlacklistModel } from '../modals/blacklist.model.js';


export const authUser = async (req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:'Unauthorized or token not found'

        })
    }

    const isTokenBlacklisted = await BlacklistModel.findOne({token})
    if(isTokenBlacklisted){
        return res.status(401).json({
            message:'Token is Invalid'
        })
    }



    try{
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded
        next()
    }
    catch(error){
        return res.status(401).json({message:'Invalid Token'})
    }
}
