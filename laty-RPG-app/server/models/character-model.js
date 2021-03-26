const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Character = new Schema(
    {
        name: { type: String, required: true },
        title : {type : String, required : false},

        deaths : {type : Number , required : false, min :0, max :4},
        willpower : {type : Number , required : true, min: -10, max : 30},

        phase : {type : Number , required : true, min:0, max:2},

        isMage : {type : Boolean, required : true},
        //Stats
        determination: { type: Number, required: true, min:0 , max :30 },
        perception: { type: Number, required: true, min:0 , max :30 },

        nobility: { type: Number, required: true, min:0 , max :30 },
        ingenuity: { type: Number, required: true, min:0 , max :30 },
        spirituality: { type: Number, required: true, min:0 , max :30 },

        magic : {type : Number, required : false, min:0 , max :30},

        bonusValor: { type: Number, required: true, min:0 , max :30 },
        bonusScheming: { type: Number, required: true, min:0 , max :30 },
        bonusEloquence: { type: Number, required: true, min:0 , max :30 },
        bonusDiplomacy: { type: Number, required: true, min:0 , max :30 },
        bonusManipulation: { type: Number, required: true, min:0 , max :30 },
        bonusTheology: { type: Number, required: true, min:0 , max :30 },

        bonusArcana  : {type : Number, required : false, min:0 , max :30},
        bonusSorcery : {type : Number, required: false, min:0 , max :30},

        // non RPG
        associatedPlayer:  {type: Schema.Types.ObjectId, ref : 'players'},
    },
    { timestamps: true },
)

module.exports = mongoose.model('characters', Character)