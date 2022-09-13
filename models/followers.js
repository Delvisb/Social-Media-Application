const { mongoose, model } = require('mongoose'); 
const Schema = mongoose.Schema;

const FollowersSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    followedBy: {
        type: String,
        required: true
    }
});

const followers = mongoose.model("Followers", FollowersSchema);
module.exports = followers;