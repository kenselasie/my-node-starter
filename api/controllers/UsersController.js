import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/userModel.js'


const getAllUsers = async (req, res) => {
    try {
        const user = await User.find().select('email')
        if (user) {
            return res.status(200).json({
                message: 'Successful',
                data: user
            })
        }
    }
    catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

const getUserById = async (req, res) => {
    try {   
        const { user_id } = req.params
        let user = await User.findById(user_id)
            .select('email')
        
        if (!user) {
            return res.status(500).json({message: 'No user found with this id'})
        }

        return res.status(200).json(user)
    }
    catch (err) {
        res.status(500).json({
            message: 'Does not exist in the database',
            error: err
        })
    }
}

const signup = async (req, res) => {
    const { email, password } = req.body
    const user = await User.find({ email: email })
    if (user.length >= 1) {
        return res.status(409).json({
            message: 'Mail already exits'
        })
    } else {
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({
                    error: err
                })
            }
            const user = new User({
                email: email,
                password: hash
            })
            let result = await user.save()
            if (!result) {
                return res.status(500).json({
                    error: err
                })    
            }

            res.status(201).json({
                message: 'User Created'
            })
            
        })
    }
}

const login = async (req, res) => {
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
}

const deleteUser = async (req, res) => {
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
}

export { getAllUsers, signup, login, deleteUser, getUserById }