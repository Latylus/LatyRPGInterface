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

const apis = {
    insertCharacter,
    getAllCharacters,
    updateCharacterById,
    deleteCharacterById,
    getCharacterById,
}

export default apis