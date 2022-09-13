const { mongoose, model } = require('mongoose'); 
const Schema = mongoose.Schema;

const PostsSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    caption : {
        type: String,
    },
    img: {
        type: String,
        required: true
    },
    profileimg: {
        type: String,
        required: true
    },
    numOfLikes: {
        type: Number,
        required: true
    },
    numOfComments: {
        type: Number,
        required: true
    },
}, {timestamps: true});

const Posts = mongoose.model("Posts", PostsSchema);
module.exports = Posts;
