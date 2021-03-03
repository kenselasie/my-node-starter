import mongoose from "mongoose";


const userSchema = mongoose.Schema({
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

export default mongoose.model('User', userSchema)