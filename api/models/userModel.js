const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique : true,
        match: /.+\@.+\..+/

    },
    password: {
        type: String,
        required: true,
        minimum: 6
    }
})

module.exports = mongoose.model('User', userSchema)