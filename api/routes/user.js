import express from 'express'
import { getAllUsers, getUserById, signup, login, deleteUser } from '../controllers/UsersController.js'

const router = express.Router()


router.get('/', async (req, res) => {
    return getAllUsers(req, res)
})

router.get('/:user_id', async (req, res) => {
    return getUserById(req, res)
})

router.post('/signup', async (req, res) => {
    return signup(req, res)
})

router.post('/login', async (req, res) => {
    return login(req, res)
})

router.delete('/:user_id', async (req, res, next) => {
    return deleteUser(req, res)
})

export default router