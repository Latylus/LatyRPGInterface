import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()
const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_API_URL,
})

//No need for auth
export const getCharacterById = id => api.get(`/character/${id}`)
export const getAllPlayerCharacters = (player_id) => api.get(`/player-characters/${player_id}`)
export const updateCharacterByIdForPlayer = (id, payload) => api.put(`/gm-character/${id}`, payload)

//Need auth
export const insertCharacter = (payload, token) => api.post(`/character`, payload, {headers : {'Authorization' : token}})
export const getAllCharacters = (token) => api.get(`/characters`,  {headers : {'Authorization' : token}})
export const deleteCharacterById = (id, token) => api.delete(`/character/${id}`,  {headers : {'Authorization' : token}})
export const updateCharacterByIdForGM = (id, payload, token) => api.put(`/gm-character/${id}`, payload, {headers : {'Authorization' : token}})

//Acquire auth
export const gmLogin = payload => api.post(`/gmLogin`, payload)

//Acount creation/editing
export const createPlayer = payload => api.post(`/player`, payload)
export const getAllPlayers = () => api.get(`/players`)
export const updatePlayerById = (id, payload) => api.put(`/player/${id}`, payload)
export const deletePlayerById = id => api.delete(`/player/${id}`)
export const getPlayerById = id => api.get(`/player/${id}`)

export const sendDiscordMessage = payload => api.post(`/discord`, payload)

const apis = {
    getCharacterById,
    getAllPlayerCharacters,
    updateCharacterByIdForPlayer,

    insertCharacter,
    getAllCharacters,
    deleteCharacterById,
    updateCharacterByIdForGM,

    gmLogin,

    createPlayer,
    getAllPlayers,
    updatePlayerById,
    deletePlayerById,
    getPlayerById,

    sendDiscordMessage,
}

export default apis