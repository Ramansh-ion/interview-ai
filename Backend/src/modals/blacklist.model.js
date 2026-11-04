import mongoose from "mongoose";   

const blacklistTokenSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true, 'Token is required to be added in the blacklist'],
    }
},
    {timestamps:true}
)

export const BlacklistModel = mongoose.model('Blacklist', blacklistTokenSchema)