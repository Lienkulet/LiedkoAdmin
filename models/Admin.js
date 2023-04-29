const { Schema, models, model } = require("mongoose");

const AdminSchema = new Schema({
    email: {type: String, require: true, unique: true}
});

export const Admin = models?.Admin || model('Admin', AdminSchema);

