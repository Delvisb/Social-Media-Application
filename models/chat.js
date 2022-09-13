const { mongoose, model } = require('mongoose'); 
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    chatId: {
        type: String,
        required: true
    },
    numOfMessages: {
        type: Number,
        required: true
    }
}, {timestamps: true});

const Chats = mongoose.model("Chats", ChatSchema)
module.exports = Chats;
