const { mongoose, model } = require('mongoose'); 
const Schema = mongoose.Schema;

const ChatMembersSchema = new Schema({
    chatId: {
        type: String,
        required: true 
    },
    member: {
        type: String,
        required: true
    }
});

const ChatMembers = mongoose.model("ChatMembers", ChatMembersSchema)
module.exports = ChatMembers;
