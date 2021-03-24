const express = require('express')
const auth = require('../middleware/auth')
const CharacterCtrl = require('../controllers/character-ctrl')

const router = express.Router()

//requires auth
router.post('/character', auth, CharacterCtrl.createCharacter)
router.put('/gm-character/:id', auth, CharacterCtrl.updateCharacter)
router.delete('/character/:id', auth, CharacterCtrl.deleteCharacter)
router.get('/characters', auth, CharacterCtrl.getCharacters)

//no auth required
router.put('/character/:id', CharacterCtrl.updateCharacterPartial)
router.get('/character/:id', CharacterCtrl.getCharacterById)
router.get('/player-characters/:id', CharacterCtrl.getCharactersForPlayer)


module.exports = router