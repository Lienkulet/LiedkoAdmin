import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Admin } from "@/models/Admin";

export default async function handler(req, res){
    await mongooseConnect();

    await isAdminRequest(req, res);

    if(req.method === 'POST'){
        const {email} = req.body;

        const alreadyExists = await Admin.findOne({email: email});

        if(alreadyExists){
            res.status(400).json({message: 'Admin already exists!'});
        } else {
            res.json( await Admin.create({email}) );        
        }
    }

    if(req.method === 'GET'){
        res.json(await Admin.find());
    }

    if(req.method === 'DELETE'){
        const {_id} = req.query;
        await Admin.findByIdAndDelete(_id);
        res.json(true);
    }
}