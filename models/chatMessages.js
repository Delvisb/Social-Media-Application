const { mongoose, model } = require('mongoose'); 
const Schema = mongoose.Schema;

const ChatMessagesSchema = new Schema({
    chatId: {
      type: String,
      required: true
    },
    sentBy:{
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
}, {timestamps: true});

const ChatMessages = mongoose.model("ChatMessages", ChatMessagesSchema)
module.exports = ChatMessages;
