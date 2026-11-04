import 'dotenv/config';
import app from './app.js';
import {connectDB} from './src/database.js';

connectDB();




app.listen(3003,()=>{
    console.log("Server is running on port 3003")
})

