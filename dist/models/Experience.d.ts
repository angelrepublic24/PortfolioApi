import { Types } from "mongoose";
interface IExperience {
    title: string;
    description: string;
    lang: string[];
    url: string;
    user: Types.ObjectId;
    date: [number, number | string];
}
declare const Experience: import("mongoose").Model<IExperience, {}, {}, {}, import("mongoose").Document<unknown, {}, IExperience> & IExperience & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>;
export default Experience;
