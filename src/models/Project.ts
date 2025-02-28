import { model, models, ObjectId, Schema } from "mongoose";

interface IProject {
    name: string;
    description: string;
    lang: string[],
    url: string,
    image?: string,
    user: ObjectId,
    date: number
}


const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true, 
    },
    lang: {
        type: [String],
    },
    url: {
        type: String,
    },
    
    image: {
        type: String,
    },
    user: {
        type: Schema.ObjectId,
        ref: "User",
        required: true,
    },
    date: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true
})

const Project = model<IProject>('Project', projectSchema);
export default Project