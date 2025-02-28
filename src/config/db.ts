import mongoose from "mongoose"
import colors from 'colors';


export const connectDB = async(): Promise<void> => {
    try{
        const { connection } = await mongoose.connect(process.env.DB_URI);
        const url = `${connection.host}:${connection.port}`;
        console.log(colors.cyan("Database connection established at " + url));
    }   catch (e) { 
        console.log(colors.bgRed.white(e))
        return e
        }
}