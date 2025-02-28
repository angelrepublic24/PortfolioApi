import User from '../models/User';
import { Request, Response } from "express"
import * as bcrypt from 'bcrypt';
import { createToken } from '../middlewares/verifyToken';


const create = async(req: Request, res: Response) => {
    try{
        const body = req.body;
        console.log(body)
        const {email} = body;
        const userExist = await User.findOne({email});

        if(userExist) {
            const error = new Error('Email already exists');
            res.status(409).json({error: error.message})
            return
        }

        const user = new User(body)
        user.password = bcrypt.hashSync(body.password, 10);
        await user.save();
        res.status(200).send({
            ok: true,
            user
        })
        return
    }   catch(err){
        res.status(500).json({error: err.message})
    }
}

const login = async (req: Request, res: Response) => {
    try{
        const body = req.body;
        const user = await User.findOne({email: body.email});
        if(!user) res.status(401).send({msg: "email not found"});

        if(!bcrypt.compareSync(body.password, user.password)){
             res.status(401).send({msg: "passwords do not match"});
             return
        }
        const token = createToken({id: user._id})
        console.log(token)

        res.status(200).json({
            status: true,
            user,
            token,
            msg: 'User authenticated'
        })
        return

    }catch(err){
        res.status(500).json({error:err.message})
        return
    }
    
}
const profile = async (req: Request, res: Response) => {
    
    res.json(req.user);
    
}

// const updateProfile = async (req: Request, res: Response) => {
//     try{
//         const {description} = req.body;
//         const username =  slugify(req.body.username, '');
//         const usernameExist = await User.findOne({username: username})
//         if(usernameExist && usernameExist.email !== req.user.email){
//             const error = new Error(`User ${username} is not available`);
//             res.status(409).json({error: error.message})
//         }
//         req.user.description = description;
//         req.user.username = username;

//         await req.user.save()
//         res.send({msg: 'Profile updated'})
//     }   catch(e){
//         const error = new Error("Error updating profile");
//         res.status(500).json({error: e.message})
//     }

// }


export {
    create,
    login,
    profile,
}