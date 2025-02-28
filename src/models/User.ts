import { Document, model, Schema } from "mongoose";


export interface IUser extends Document {
    name: string;
    lName: string;
    email: string;
    password: string;
    description: string;
}

const userSchema = new Schema({
    name: {
        required: true,
        type: String,
        trim: true,
    },
    lName: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        type: String,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        required: true,
        type: String,
        trim: true,
    },
    description: {
        type: String,
        default: ""
    }
})
userSchema.methods.toJSON = function(){
    let users = this;
    let userObject = users.toObject();
    delete userObject.password;
    return userObject;
}


const User = model<IUser>('User', userSchema);
export default User