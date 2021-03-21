const express = require('express')

const DiscordCtrl = require('../controllers/discord-ctrl')

const router = express.Router()

router.post('/discord', DiscordCtrl.sendDiscordMessage)

module.exports = router