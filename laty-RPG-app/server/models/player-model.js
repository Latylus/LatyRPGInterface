const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Player = new Schema(
    {
        name: { type: String, required: true },
        isGameMaster: { type: Boolean, required: true },
        associatedCharacters:  [{type: Schema.Types.ObjectId, ref : 'characters'}],
    },
    { timestamps: true },
)

module.exports = mongoose.model('players', Player)