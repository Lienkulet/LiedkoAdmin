import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Categories";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res){
    const {method} = req;

    await mongooseConnect();
    await isAdminRequest(req, res);

    if(method === 'GET'){
        res.json(await Category.find().populate('parent'));
    }

    if(method === 'POST'){
        const {name, parentCategory, properties} = req.body;
        const categoryDoc = await Category.create({
            name, 
            parent: parentCategory,
            properties
        });
        res.json(categoryDoc);
    }

    if(method === 'PUT'){
        const {name, parentCategory, properties, _id} = req.body;
        const categoryDoc = await Category.updateOne(
        {
            _id
        },
        {
            name, 
            parent: parentCategory,
            properties: properties
        });
        
        res.json(categoryDoc);
    }

    if(method === 'DELETE'){
        if(req.query?.id){
        await Category.deleteOne({_id: req.query.id});
        res.json(true);
        }
    }
}