import { model, Schema, Types } from "mongoose";

interface IExperience {
    title: string;
    description: string;
    lang: string[],
    url: string,
    user: Types.ObjectId,
    date: [number, number | string];
}


const experienceSchema = new Schema({
    company: {
        type: String,
        required: true,
    },
    position: {
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
    user: {
        type: Schema.ObjectId,
        ref: "User",
        required: true,
    },
    url: {
        type: String,
    },
    date: {
        type: [Schema.Types.Mixed],
        required: true,
        validate: {
            validator: function (value: [number, number | string]) {
                return (
                    Array.isArray(value) &&
                    value.length === 2 &&
                    typeof value[0] === "number" &&
                    (typeof value[1] === "number" || typeof value[1] === "string") &&
                    value[0] <= (typeof value[1] === "number" ? value[1] : new Date().getFullYear())
                );
            },
            message: "The field must be an array with 2 valid values: [startYear (number), endYear (number|string)]"
        }
    }
}, {
    timestamps: true
})

const Experience = model<IExperience>('Experience', experienceSchema);
export default Experience