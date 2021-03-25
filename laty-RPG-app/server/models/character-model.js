const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Character = new Schema(
    {
        name: { type: String, required: true },
        title : {type : String, required : false},

        deaths : {type : Number , required : false},
        willpower : {type : Number , required : true},

        phase : {type : Number , required : true},

        isMage : {type : Boolean, required : true},
        //Stats
        determination: { type: Number, required: true },
        perception: { type: Number, required: true },

        nobility: { type: Number, required: true },
        ingenuity: { type: Number, required: true },
        spirituality: { type: Number, required: true },

        magic : {type : Number, required : false},

        bonusValor: { type: Number, required: true },
        bonusScheming: { type: Number, required: true },
        bonusEloquence: { type: Number, required: true },
        bonusDiplomacy: { type: Number, required: true },
        bonusManipulation: { type: Number, required: true },
        bonusTheology: { type: Number, required: true },

        bonusArcana  : {type : Number, required : false},
        bonusSorcery : {type : Number, required: false},

        // non RPG
        associatedPlayer:  {type: Schema.Types.ObjectId, ref : 'players'},
    },
    { timestamps: true },
)

module.exports = mongoose.model('characters', Character)