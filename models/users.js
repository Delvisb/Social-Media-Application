const { mongoose, model } = require('mongoose'); 
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profileimg: {
        type: String,
        required: true
    },
    numOfFollowing: {
        type: Number,
        require: true
    },
    numOfFollowers :{
        type: Number,
        require: true
    }
}, {timestamps: true});

const Users = mongoose.model("Users", UserSchema);
module.exports = Users;
