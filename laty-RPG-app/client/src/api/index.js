import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()
const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_API_URL,
})

export const insertCharacter = payload => api.post(`/character`, payload)
export const getAllCharacters = () => api.get(`/characters`)
export const updateCharacterById = (id, payload) => api.put(`/character/${id}`, payload)
export const deleteCharacterById = id => api.delete(`/character/${id}`)
export const getCharacterById = id => api.get(`/character/${id}`)

export const gmLogin = payload => api.post(`/gmLogin`, payload)
export const createPlayer = payload => api.post(`/player`, payload)
export const getAllPlayers = () => api.get(`/players`)
export const updatePlayerById = (id, payload) => api.put(`/player/${id}`, payload)
export const deletePlayerById = id => api.delete(`/player/${id}`)
export const getPlayerById = id => api.get(`/player/${id}`)
export const addCharacterToPlayer = (id, character_id) => api.get(`/player/${id}/add_character/${character_id}`)
export const removeCharacterFromPlayer =  (id, character_id) => api.get(`/player/${id}/remove_character/${character_id}`)

export const sendDiscordMessage = payload => api.post(`/discord`, payload)

const apis = {
    gmLogin,
    insertCharacter,
    getAllCharacters,
    updateCharacterById,
    deleteCharacterById,
    getCharacterById,
    createPlayer,
    getAllPlayers,
    updatePlayerById,
    deletePlayerById,
    getPlayerById,
    addCharacterToPlayer,
    removeCharacterFromPlayer,
    sendDiscordMessage,
}

export default apis