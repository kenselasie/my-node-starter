const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')

router.get('/', (req, res, next) => {
    User.find()
    .select('id email')
    .exec()
    .then(users => {
        res.status(200).json({
            users
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if (user.length >=1) {
            return res.status(409).json({
                message: 'Mail already exits'
            })
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    })
                } else {
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    })   
                    user.save()
                    .then(result => {
                        console.log(result)
                        res.status(201).json({
                            message: 'User Created'
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    })
                }
            })
        }
    }) 
})

router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email }).exec()
    .then(user => {
        console.log(user)
        if (user.length < 1) {
            return res.status(401).json({
                message: 'Auth failed'
            })
            
        } else {
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    })
                }
                if (result) {
                    const token = jwt.sign({
                                    email: user[0].email,
                                    userId: user[0]._id
                                }, process.env.JWT_KEY, {
                                    expiresIn: '1h'
                                })

                    return res.status(200).json({
                        message: 'Auth successful',
                        token
                    })
                }
                res.status(401).json({
                    message: 'Auth failed'
                })
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

router.delete('/:userId', (req, res, next) => {
    User.findById(req.params.userId).exec()
    .then(result => {
        if(result) {
            User.remove({ _id: req.params.userId }).exec()
            .then(message => {
                res.status(200).json({
                    message: 'User Deleted'
                })
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            })
        } else {
            res.status(500).json({
                message: 'No such user exits to be deleted'
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
    
})


module.exports = router