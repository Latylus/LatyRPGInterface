const { json } = require('body-parser');
const axios = require('axios')
const dotenv = require('dotenv')


sendDiscordMessage = async (req, res) => {
    dotenv.config()
    const body = req.body
      
    axios.post(body.webhook, body.message, {
        headers : {
            "Content-type" : 'application/json',
        }, 
    })
    .then(() => {
        return res.status(200).json({
            success : true,
            message : 'message sent',
        })
    })
    .catch((error) => {
        return res.status(400).json({
            error,
            message: 'error sending message to discord',
        })
    })
}

module.exports = {
    sendDiscordMessage,
}