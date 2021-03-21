const express = require('express')

const PlayerCtrl = require('../controllers/player-ctrl')

const router = express.Router()

router.post('/player', PlayerCtrl.createPlayer)
router.put('/player/:id', PlayerCtrl.updatePlayer)
router.delete('/player/:id', PlayerCtrl.deletePlayer)
router.get('/player/:id', PlayerCtrl.getPlayerById)
router.get('/players', PlayerCtrl.getPlayers)
router.put('/player/:id/add_character/:character_id', PlayerCtrl.addCharacterToPlayer)
router.put('/player/:id/remove_character/:character_id', PlayerCtrl.removeCharacterFromPlayer)

module.exports = router