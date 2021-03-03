import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/userModel.js'

const router = express.Router()


router.get('/', async (req, res) => {
    try {
        const user = await User.find().select('email')
        if (user) {
            res.status(200).json({
                user
            })
        }
    }
    catch (err) {
        res.status(500).json({
            error: err
        })
    }
})

router.post('/signup', async (req, res) => {
    const user = await User.find({ email: req.body.email })
    if (user.length >= 1) {
        return res.status(409).json({
            message: 'Mail already exits'
        })
    } else {
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({
                    error: err
                })
            }
            const user = new User({
                email: req.body.email,
                password: hash
            })
            let result = await user.save()
            if (result) {
                res.status(201).json({
                    message: 'User Created'
                })
            }
            res.status(500).json({
                error: err
            })

        })
    }
})

router.post('/login', async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(401).json({
                message: 'Auth failed'
            })
        }
        const match = await bcrypt.compare(req.body.password, user.password)
        if (match) {
            const token = jwt.sign({
                email: user.email,
                userId: user._id
            }, process.env.JWT_KEY, {
                expiresIn: '1h'
            })

            return res.status(200).json({
                message: 'Auth successful',
                token
            })
        }
        return res.status(401).json({
            message: 'Auth failed'
        })
    }
    catch (err) {
        return res.status(500).json({
            error: err
        })
    }
})

router.delete('/:user_id', async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.params.user_id })
        if (!user) return res.status(500).json({
            message: 'No such user exits to be deleted'
        })

        const remove = await User.remove({ _id: req.params.user_id })

        res.status(200).json({
            message: 'User Deleted'
        })
    }
    catch (err) {
        res.status(500).json(err)
    }

})

export default router