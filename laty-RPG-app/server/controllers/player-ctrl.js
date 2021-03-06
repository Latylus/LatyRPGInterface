const Character = require('../models/character-model')
const Player = require('../models/player-model')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken');
dotenv.config()

gmLogin = async(req,res) =>{
    const enteredPassword = req.body.password
    const playerId = req.body.playerId

    if( enteredPassword === process.env.GM_PASSWORD){
        const token = jwt.sign({_id : playerId}, process.env.PRIVATE_JWK_KEY)
        return res.status(200).json({
            success : true,
            token : token
        })
    }
    else{
        return res.status(403).json({
            success : false,
            error : 'Wrong password'
        })
    }
}


createPlayer = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a player',
        })
    }
    
    const player = new Player(body)

    if (!player) {
        return res.status(400).json({ success: false, error: "Couldn't create player from data" })
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
        player.discordWebhook = body.discordWebhook
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
                console.log(error)
                return res.status(404).json({
                    error,
                    message: 'Player not updated!',
                })
            })
               
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


module.exports = {
    gmLogin,
    createPlayer,
    updatePlayer,
    deletePlayer,
    getPlayers,
    getPlayerById,
}