import { ObjectId } from "mongoose";
interface IProject {
    name: string;
    description: string;
    lang: string[];
    url: string;
    image?: string;
    user: ObjectId;
    date: number;
}
declare const Project: import("mongoose").Model<IProject, {}, {}, {}, import("mongoose").Document<unknown, {}, IProject> & IProject & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>;
export default Project;
