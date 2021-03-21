const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const db = require('./db')
const characterRouter = require('./routes/character-router')
const playerRouter = require('./routes/player-router')
const discordRouter = require('./routes/discord-router')

const app = express()
const apiPort = process.env.LOCAL_PORT || process.env.PORT

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api', characterRouter)
app.use('/api', playerRouter)
app.use('/api', discordRouter)

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))