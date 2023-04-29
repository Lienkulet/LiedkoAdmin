import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Settings } from "@/models/Settings";

export default async function handler(req, res){
    await mongooseConnect();
    await isAdminRequest(req, res);

    if(req.method === 'PUT'){
        const {name, value} = req.body;

        const featuredDoc = await Settings.findOne({name});

        if(featuredDoc){
            featuredDoc.value = value;
            await featuredDoc.save();
            res.json(featuredDoc);
        } else {
            res.json(await Settings.create({name, value}));
        }
    }

    if(req.method === 'GET'){
         const {name} = req.query;
         res.json( await Settings.findOne({name}) );
    }
}