const Character = require('../models/character-model')
const Player = require('../models/player-model')

createCharacter = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a character',
        })
    }

    const character = new Character(body)

    if (!character) {
        return res.status(400).json({ success: false, error: err })
    }

    //add character to dms list
    await Player.find({isGameMaster : true}, (err, gameMasters) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (gameMasters) {
            gameMasters.forEach(GM =>{
                GM.associatedCharacters.push(character._id)
                GM.save().catch(error => {
                    return res.status(400).json({
                        error,
                        message: 'Failed to update GMs, character not created',
                    })
                })
            })
        }
    }).catch(err => console.log(err))

    character
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: character._id,
                message: 'Character created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Character not created noob!',
            })
        })
}

updateCharacter = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Character.findOne({ _id: req.params.id }, (err, character) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Character not found!',
            })
        }
        character.name = body.name
        character.time = body.time
        character.strength = body.strength
        character
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: character._id,
                    message: 'Character updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Character not updated!',
                })
            })
    })
}

deleteCharacter = async (req, res) => {
    await Character.findOneAndDelete({ _id: req.params.id }, (err, character) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!character) {
            return res
                .status(404)
                .json({ success: false, error: `Character not found` })
        }
      
    }).catch(err => console.log(err))

    //remove character from dms list
    await Player.find({isGameMaster : true}, (err, gameMasters) => {

        if (gameMasters) {
            gameMasters.forEach(GM => {
                foundIndex = GM.associatedCharacters.indexOf(character._id)
                if(foundIndex > -1){
                    GM.associatedCharacters.splice(foundIndex, 1)
                }
                GM.save().catch(error => {
                    return res.status(400).json({
                        error,
                        message: 'Failed to update GMs, character was deleted',
                    })
                })
            })
        }
    }).catch(err => console.log(err))

    return res.status(200).json({ success: true, data: character })
}

getCharacterById = async (req, res) => {
    await Character.findOne({ _id: req.params.id }, (err, character) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!character) {
            return res
                .status(404)
                .json({ success: false, error: `Character not found` })
        }
        return res.status(200).json({ success: true, data: character })
    }).catch(err => console.log(err))
}

getCharacters = async (req, res) => {
    await Character.find({}, (err, characters) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!characters) {
            return res
                .status(404)
                .json({ success: false, error: `Characters not found` })
        }
        return res.status(200).json({ success: true, data: characters })
    }).catch(err => console.log(err))
}

module.exports = {
    createCharacter,
    updateCharacter,
    deleteCharacter,
    getCharacters,
    getCharacterById,
}