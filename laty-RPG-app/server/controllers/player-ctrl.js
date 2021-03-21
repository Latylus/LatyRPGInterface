const Character = require('../models/character-model')
const Player = require('../models/player-model')

createPlayer = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a player',
        })
    }

    // The DM should have all existing characters associated automatically
    if(body.isGameMaster){
        await Character.find({}, (err, characters) => {
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }
            if (!characters) {
                console.log("No characters to add for DM")
            }
            body.associatedCharacters = characters.map(cha => cha._id)
        }).catch(err => console.log(err))
    }

    const player = new Player(body)

    if (!player) {
        return res.status(400).json({ success: false, error: err })
    }

    player
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: player._id,
                message: 'player created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'player not created!',
            })
        })
}

updatePlayer = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Player.findOne({ _id: req.params.id }, async (err, player) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Character not found!',
            })
        }

        player.name = body.name
        player.isGameMaster = body.isGameMaster
        player.associatedCharacters = body.associatedCharacters

        // The GMs should have all existing characters associated automatically
        if(body.isGameMaster){
            await Character.find({}, (err, characters) => {
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!characters) {
                    console.log("No characters to add for DM")
                }
                player.associatedCharacters = characters.map(cha => cha._id)
                player
                .save()
                .then(() => {
                    return res.status(200).json({
                        success: true,
                        id: player._id,
                        message: 'Player updated!',
                    })
                })
                .catch(error => {
                    return res.status(404).json({
                        error,
                        message: 'Player not updated!',
                    })
                })
            }).catch(err => console.log(err))
        }
        else{
            player
                .save()
                .then(() => {
                    return res.status(200).json({
                        success: true,
                        id: player._id,
                        message: 'Player updated!',
                    })
                })
                .catch(error => {
                    return res.status(404).json({
                        error,
                        message: 'Player not updated!',
                    })
                })
        }       
    })
}

deletePlayer = async (req, res) => {
    await Player.findOneAndDelete({ _id: req.params.id }, (err, player) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!player) {
            return res
                .status(404)
                .json({ success: false, error: `Player not found` })
        }

        return res.status(200).json({ success: true, data: player })
    }).catch(err => console.log(err))
}

getPlayerById = async (req, res) => {
    await Player.findOne({ _id: req.params.id }, (err, player) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!player) {
            return res
                .status(404)
                .json({ success: false, error: `Player not found` })
        }
        return res.status(200).json({ success: true, data: player })
    }).catch(err => console.log(err))
}

getPlayers = async (req, res) => {

    
    await Player.find({}, (err, players) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!players) {
            return res
                .status(404)
                .json({ success: false, error: `Players not found` })
        }
        return res.status(200).json({ success: true, data: players })
    }).catch(err => console.log(err))
}

addCharacterToPlayer = async (req, res) => {
    await Player.findOne({ _id: req.params.id }, (err, player) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!player) {
            return res
                .status(404)
                .json({ success: false, error: `Player not found` })
        }
        
        player.associatedCharacters.push(req.params.character_id)
        player.save().catch(error => {
            return res.status(400).json({
                error,
                message: 'Failed to update Player, character not added to his list',
            })
        })
    }).catch(err => console.log(err))
}

removeCharacterFromPlayer = async (req, res) => {
    await Player.findOne({ _id: req.params.id }, (err, player) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!player) {
            return res
                .status(404)
                .json({ success: false, error: `Player not found` })
        }
        foundIndex = player.associatedCharacters.indexOf(req.params.character_id)
        if(foundIndex > -1){
            player.associatedCharacters.splice(foundIndex, 1)
        }
        player.save().catch(error => {
            return res.status(400).json({
                error,
                message: 'Failed to update Player, character not added to his list',
            })
        })
    }).catch(err => console.log(err))
}

module.exports = {
    createPlayer,
    updatePlayer,
    deletePlayer,
    getPlayers,
    getPlayerById,
    addCharacterToPlayer,
    removeCharacterFromPlayer,
}