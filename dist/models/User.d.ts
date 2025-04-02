import { Document } from "mongoose";
export interface IUser extends Document {
    name: string;
    lName: string;
    email: string;
    password: string;
    description: string;
}
declare const User: import("mongoose").Model<IUser, {}, {}, {}, Document<unknown, {}, IUser> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default User;
