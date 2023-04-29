const { Schema, models, model } = require("mongoose");

const SettingsSchema = new Schema({
    name: {type: String, require: true, uniqu: true },
    value: {type: Object}
}, {
    timestamps: true
});

export const Settings = models?.Settings || model('Settings', SettingsSchema);