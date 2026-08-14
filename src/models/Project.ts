import { model, models, ObjectId, Schema } from "mongoose";

interface IProjectLink {
    label: string;   // e.g. "Website", "iOS App", "Android App"
    url: string;
}

interface IProject {
    name: string;
    description: string;
    lang: string[],
    url: string,
    image?: string,
    user: ObjectId,
    date: number,
    hidden?: boolean,
    order?: number,
    // --- Drawing Set design metadata (all optional; rendered when present, otherwise derived on the frontend) ---
    summary?: string;            // short one-line plain-text subtitle for the project sheet
    kind?: string;               // 'personal' | 'client' | 'employer'
    client?: string;             // title-block "Client" label, e.g. "Personal", "Client · DRTS", "Employer"
    role?: string;               // e.g. "Sole engineer", "Lead Developer & Architect"
    status?: string;             // 'live' | 'in-dev' | 'pre-launch' | 'frontier' | 'archived'
    disciplines?: string[];      // subset of ['WEB','APP','API','DB','PAY','OPS','3D']
    featured?: boolean;          // true => rendered as a full project sheet; false => archive list
    links?: IProjectLink[];      // extra destinations (website + app stores…); `url` stays the primary one
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
    },
    hidden: {
        type: Boolean,
        default: false,
    },
    order: {
        type: Number,
        default: 0,
    },
    // --- Drawing Set design metadata ---
    summary: {
        type: String,
    },
    kind: {
        type: String,
        enum: ["personal", "client", "employer"],
    },
    client: {
        type: String,
    },
    role: {
        type: String,
    },
    status: {
        type: String,
        enum: ["live", "in-dev", "pre-launch", "frontier", "archived"],
    },
    disciplines: {
        type: [String],
    },
    featured: {
        type: Boolean,
    },
    links: {
        type: [
            new Schema<IProjectLink>(
                {
                    label: { type: String, required: true },
                    url: { type: String, required: true },
                },
                { _id: false }
            ),
        ],
        default: undefined,
    },
}, {
    timestamps: true
})

const Project = model<IProject>('Project', projectSchema);
export default Project
