const { mongoose, model } = require('mongoose'); 
const Schema = mongoose.Schema;

const PostsLikesSchema = new Schema({
    imgId: {
        type: String,
        required: true
    },
    likedBy: {
        type: String,
        required: true
    }
});

const postLikes = mongoose.model("PostLikes", PostsLikesSchema);
module.exports = postLikes;