const { Schema, model, models, default: mongoose } = require("mongoose");

const CategorySchema = new Schema({
    name: {type: String, require: true},
    parent: {type: mongoose.Types.ObjectId, ref:'Category', require: false},
    properties: [{type: Object}]
});

export const Category = models.Category || model('Category', CategorySchema);