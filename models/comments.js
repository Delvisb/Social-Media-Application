const { mongoose, model } = require('mongoose'); 
const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
    imgId: {
        type: String,
        required: true
    },
    commentedBy: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
});

const comments = mongoose.model("Comments", CommentsSchema);
module.exports = comments;