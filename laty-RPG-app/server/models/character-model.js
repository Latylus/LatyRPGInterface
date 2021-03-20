const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Character = new Schema(
    {
        name: { type: String, required: true },
        time: { type: [String], required: true },
        strength: { type: Number, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('characters', Character)