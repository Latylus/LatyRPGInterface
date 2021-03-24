const Character = require('../models/character-model')
const Player = require('../models/player-model')

//Requires auth
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
        character.associatedPlayer = body.associatedPlayer
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
        console.log('Deleted character')
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


//Doesnt require auth
getCharactersForPlayer = async (req, res) => {
    const player_id = req.params.id

    await Character.find({associatedPlayer : player_id}, (err, characters) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        return res.status(200).json({ success: true, data: characters })
    }).catch(err => console.log(err))
}

updateCharacterPartial = async (req, res) => {
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

getCharacterById = async (req, res) => {
    // await 
    // new Promise((resolve) => {
    //     setTimeout(resolve, 1000)
    // })
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





module.exports = {
    createCharacter,
    updateCharacterPartial,
    updateCharacter,
    deleteCharacter,
    getCharacters,
    getCharactersForPlayer,
    getCharacterById,
}