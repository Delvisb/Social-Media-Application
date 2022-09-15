const express = require("express")
const app = express();
const bcrypt = require("bcrypt")
const bodyParser = require("body-parser");
const { mongoose } = require('mongoose');
const cors = require("cors")
const fs = require('fs');
const uuid = require('uuid')

//models
const Users = require("./models/users");
const Posts = require("./models/posts");
const PostLikes = require("./models/postLikes");
const Followers = require("./models/followers");
const Comments = require("./models/comments");
const Chat = require("./models/chat")
const ChatMembers = require("./models/chatMembers");
const ChatMessages = require("./models/chatMessages")

//database connection
async function dbConnection(){
    //Credentials taken off for security purposes
    const uri = "mongodb+srv://<Username>:<Password>@capture.lmjrqc9.mongodb.net/Capture?retryWrites=true&w=majority"; 
    mongoose.connect(uri, {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    })
    .then((result)=> console.log("Connected to database"))
    .catch((err)=>console.log(err))
}
dbConnection().catch(console.error);

//Application settings
require('dotenv').config();
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
var corsOptions = {
    origin: [`${process.env.server_url}:19001`, `${process.env.server_url}:19006`],
    optionsSuccessStatus: 200 
}
app.use('/images', express.static('images'));


//Routes

// Registration route using bcrypt and mongodb
app.post("/register", async (req, res)  => {
    let username = req.body.username;
    let firstname =  req.body.firstname;
    let lastname = req.body.lastname;
    let email =  req.body.email;
    let hashedPassword = bcrypt.hashSync(req.body.password, 10);
    let base64 = req.body.uri;

    function validateForm(){
        if(!username || !firstname || !lastname || !email || !hashedPassword || !base64){
            errors = true;
            return errors
        }else{
            errors = false;
            return errors
        }
    }
    
    validateForm()

    if(errors){
        res.status(400).send({message: 'Missing Credentials'});
    }else{
        let user = await Users.findOne({ username: username});
        if (user) {
            res.status(400).send({message: 'That user already exists!'});
        } 
        else{
            let uri = base64.split(';base64,').pop();
            let uniqueProfileImgPath =  "/images/" +username+  '-' + uuid.v1() + ".jpeg";
            let dbProfileImgPath = process.env.server_url + uniqueProfileImgPath

            fs.writeFile("."+uniqueProfileImgPath, uri, {encoding: 'base64'}, function(err) {
                if(err){
                    console.log(err)
                }else{
                    const newUser = new Users({ 
                        username: username,
                        firstname: firstname,
                        lastname, lastname,
                        email: email,
                        password: hashedPassword,
                        profileimg: dbProfileImgPath,
                        numOfFollowing: '0',
                        numOfFollowers: '0'
                    });
                    newUser.save()
                    .then((result) => {
                        res.status(200).send({message: 'Registered! Please sign in'});
                    })
                    .catch((e)=>
                        console.error(e)
                    )
                }
            });
        }
    }
});

//Login route using bcrypt compare and mongodb
app.post("/login", async (req, res) =>{
    let username = req.body.username
    let password = req.body.password
    if(username.length === 0){
        res.status(400).json({message: "Missing Username "})
    }
    else{
        if(password.length === 0){
            res.status(400).json({message: "Missing Password "})
        }
        else{
            let userFound =  await Users.findOne({ username: username})
            if (userFound) {
                let passwordMatch = await bcrypt.compare(password, userFound.password)
                if(passwordMatch){
                    res.status(200).json( {message : "You are now logged in"})
                }
                else{
                    res.status(400).json({message: "Incorrect Password "})
                }
            }
            else{
                res.status(400).json({message : "Username not found"})
            }
        }
    }

})

// Query searching for a post's data from the database
app.get("/getPost/:id", async (req, res)=> {
    let post = await Posts.findOne({_id: req.params.id});
        if(post){
            res.status(200).json({response: post})
        }
});

// Query used to send all posts data 
app.get("/getPosts", async (req, res)=> {
    let posts = await Posts.find()
    let postLikes = await PostLikes.find()
    if(posts.length > 0 && postLikes){
        res.status(200).json({response: posts, response2: postLikes})
    }else{
        res.status(404).json({response: "No Posts"})
    }
});

//Route that accepts the user uploading, as well as the post's caption and uri
app.post("/upload", async (req, res) => {
    let user = req.body.user;
    let caption = req.body.caption;
    let base64 = req.body.uri;

    let uri = base64.split(';base64,').pop();
    let uniqueImgPath =  "/images/" +user+  '-' + uuid.v1() + ".jpg";
    let dbImgPath = process.env.server_url + uniqueImgPath
    
    let userFound =  await Users.findOne({ username: user})
    if (userFound) {
        let profileimg = userFound.profileimg

        fs.writeFile("."+uniqueImgPath, uri, {encoding: 'base64'}, function(err) {
        if(err){
                console.log(err)
        }else{
            res.status(200).json({messgae: "Image Uploaded!"})
                const newPost = new Posts({
                    username: user,
                    caption: caption,
                    img: dbImgPath,
                    profileimg: profileimg,
                    numOfLikes: 0,
                    numOfComments: 0
                })
                newPost.save()
                    .then((res)=>{
                        console.log(res)
                    })
                    .catch((e) =>
                        console.error(e)
                    )
            }
        });
    }
})

//Route used for viewing a user's profile whether searched, or view on the profile page
app.post("/profile", async (req, res) => {
    let user = req.body.user;
    let search = req.body.search;
    let searchedUser = await Users.findOne({ username: search}, {password: 0, updatedAt: 0, __v: 0});
    let searchedUsersPosts = await Posts.find({ username: search}, { createdAt: 0, updatedAt: 0, __v: 0});
    let isFollowing =  await Followers.find({ username: search, followedBy: user})

    if(isFollowing.length !== 0){
        isFollowing = true
    }else{
        isFollowing = false
    }

    if(searchedUser && searchedUsersPosts){
        res.status(200).json({response: searchedUser, response2: searchedUsersPosts, response3: isFollowing})
    }else{
        res.status(404) 
    }
});

// Route used for searching for another user 
app.post("/searchUser", async (req, res)=>{
    let searchName = req.body.searchName
    let resultsFound = await Users.find({ username: searchName})
    if(resultsFound.length !== 0){
        res.status(200).json({response: resultsFound[0].username, response2: resultsFound[0].profileimg})
    }else{
        res.status(404).json({response: "None result"})
    } 
});

//Route used to follow, and unfollow another user 
app.post('/followUnfollowUser', async (req, res) => {
    let follower = req.body.user;
    let userToFollow = req.body.userToFollow;

    let alreadyFollowed = await Followers.findOne({username: userToFollow, followedBy: follower })
    if(alreadyFollowed){
        let userUnfollowed = await Followers.deleteOne({username: userToFollow, followedBy: follower})
        let userFollowerDecrement = await Users.findOneAndUpdate({username: userToFollow}, {$inc : {'numOfFollowers' : -1}})
        let userFollowingDecremnt = await Users.findOneAndUpdate({username: follower}, {$inc : {'numOfFollowing' : -1}})
        if(userUnfollowed && userFollowerDecrement && userFollowingDecremnt){
            res.status(200).json({response: "User Unfollowed"})
        }
    }else{
        const newFollower = new Followers({ 
            username: userToFollow, 
            followedBy: follower
        });
        newFollower.save()
        .then(async () => {
            try{
                let followersIncrement = await Users.findOneAndUpdate({username : userToFollow}, {$inc : {'numOfFollowers' : 1}})
                let follwingIncrement = await Users.findOneAndUpdate({username: follower}, {$inc : {'numOfFollowing' : 1}})
                if(followersIncrement && follwingIncrement){
                    res.status(200).json({response: "User Followed!"})
                }
            }catch(err){
                console.log(err)
            }
        })
        .catch((e)=>
            console.error(e),
            res.status(400)
        )
    }
});

//Route used to like, and unlike a post 
app.post('/likeUnlikeImg', async (req, res) => {
    let user = req.body.user;
    let imgId = req.body.id;  

    let alreadyLiked = await PostLikes.findOne({imgId: imgId, likedBy: user })
    if(alreadyLiked){
        let imageUnliked = await PostLikes.deleteOne({imgId: imgId, likedBy: user });
        let postLikesDecrement = await Posts.findOneAndUpdate({_id : imgId}, {$inc : {'numOfLikes' : -1}})
        if(imageUnliked && postLikesDecrement ){
            res.status(200).json({response: "Image Unliked"})
        }
    }else{
        const imageLiked = new PostLikes({ 
            imgId: imgId, 
            likedBy: user
        });
        imageLiked.save()
        .then(async () => {
            try{
                let like = await Posts.findOneAndUpdate({_id : imgId}, {$inc : {'numOfLikes' : 1}})
                if(like){
                    res.status(200).json({response: "Image Liked"})
                }
            }catch(err){
                console.err(err)
            }
        })
        .catch((e)=>
            console.error(e),
            res.status(400)
        )
    }
}); 

//Route used to get the likers of a user's post 
app.get('/getLikes/:imgId', async (req, res) =>{
    let imgId = req.params.imgId; 
    let postLikes = await PostLikes.find({imgId: imgId})
    
    let postLikersList = [];
    for(let i = 0; i < postLikes.length ; i++){
        let match =  await Users.find({ username: postLikes[i].likedBy}, {profileimg: 1, username: 1});
        if(match){
            postLikersList.push(match)
        }
    }   
    if(postLikersList){
        res.status(200).json({response: postLikes, response2: postLikersList})
    }
})

//Route used to add comments to a user's post 
app.post('/addComment', async (req, res) =>{
    let imgId = req.body.imgId;
    let commentedBy = req.body.user;  
    let comment = req.body.comment;

    if(imgId && commentedBy && comment){
        const newComment = new Comments({ 
            imgId: imgId, 
            commentedBy: commentedBy,
            comment: comment
        });
        newComment.save()
        .then(async () => {
            try{
                let comment = await Posts.findOneAndUpdate({_id : imgId}, {$inc : {'numOfComments' : 1}})
                if(comment){
                    res.status(200).json({response: "Comment Added"})
                }
            }catch(err){
                console.err(err)
            }
        })
        .catch((e)=>
            console.error(e),
            res.status(400)
        )
    }
});

//Route used to get the comments of a post from the DB
app.get('/getComments/:imgId', async  (req, res) => {
    let imgId = req.params.imgId; 
    let comments = await Comments.find({imgId: imgId})
    
    let commentersList = [];
    for(let i = 0; i < comments.length ; i++){
        let match =  await Users.find({ username: comments[i].commentedBy}, {profileimg: 1, username: 1});
        if(match){
            commentersList.push(match)
        }
    }  

    if(commentersList){
        res.status(200).json({response: comments, response2: commentersList})
    }
})

//Route used to get the followers of a searched user
app.get('/getFollowers/:search', async (req, res) =>{
    let search = req.params.search; 
    let followers = await Followers.find({username: search})
    let followerList= []

    for(let i = 0; i < followers.length ; i++){
        let match =  await Users.find({username: followers[i].followedBy}, {profileimg: 1, username: 1});
        if(match){
            followerList.push(match)
        }
    } 
    res.status(200).json({response: followers, response2: followerList}) 
})

//Route used to get the followers of a searched user
app.get('/getFollowing/:search', async (req, res) =>{
    let search = req.params.search; 
    let following = await Followers.find({followedBy: search})
    let followingList = []

    for(let i = 0; i < following.length ; i++){
        let match =  await Users.find({username: following[i].username}, {profileimg: 1, username: 1});
        if(match){
            followingList.push(match)
        }
    } 
    res.status(200).json({response: following, response2: followingList}) 
});

//Route used to create an unique name in the database for users to chat 
app.post('/createChat', async (req,res) =>{
    let user = req.body.user;
    let member = req.body.member;

    //Chat ids are created using the two users username with "Chat" at the end 
    if(user && member){ 
        let chatId = user + "+" + member + "Chat"
        let chatAlreadyExists =  await Chat.find({chatId: chatId})
        let chatId2 = member + "+" + user + "Chat"
        let chatAlreadyExists2 =  await Chat.find({chatId: chatId2}) 
    
        if(chatAlreadyExists.length < 1 && chatAlreadyExists2.length < 1 ){
            const newChat  = new Chat({ 
                chatId:  chatId,
                numOfMessages: 0
            });
            newChat.save()
            .then( () => {
                const newMember  = new ChatMembers({ 
                    chatId:  chatId,
                    member: user
                });
                newMember.save()
            })
            .then( () => {
                const newMember2 = new ChatMembers({
                    chatId:  chatId,
                    member: member
                })
                newMember2.save()
            })
            .finally( ()=>{
                res.status(200).json({response: chatId})
            })
            .catch((e)=>
                console.error(e),
                res.status(400)
            )
        }else{
            if(chatAlreadyExists.length > 0){
                res.status(409).json({response: chatId})
            }else{
                res.status(409).json({response: chatId2})
            }
        }

    }
})

//Route used to send the chat members and their messages to the client-side 
app.get('/getChat/:chatId', async (req, res) =>{
    let chatId = req.params.chatId;
    let chatMembers = await ChatMembers.find({chatId: chatId})
    let chatMessages =  await ChatMessages.find({chatId: chatId})

    let members = []
    for(let i = 0; i < chatMembers.length ; i++){
        let match =  await Users.find({username: chatMembers[i].member}, {profileimg: 1, username: 1});
        if(match){
            members.push(match)
        }
    } 
    if(chatMessages && members){
        res.status(200).json({messages: chatMessages, members: members })
    }
})

//Route used for adding a new direct message in the DB 
app.post('/addMessage', async (req, res)=>{
    let chatId = req.body.chatId
    let sentBy = req.body.sentBy
    let message = req.body.message

    const newMessage = new ChatMessages({
        chatId: chatId,
        sentBy: sentBy,
        message: message
    })
    newMessage.save()
    .then( () =>{
        res.status(200).json({response: 'Message Sent'})
    })
})

//Route used to show the list of currently created chat from the database, which appears on the Chat Page
app.get('/getChatList/:user', async (req, res) =>{
    let user = req.params.user;
    let found = await ChatMembers.find({member: user}, {chatId: 1, numOfMessages: 1})
    
    let list = []
    for(let i =0; i<found.length; i++){
        let match = await ChatMembers.find({chatId: found[i].chatId, member: {$ne : user}}, {_id: 0, member: 1})
        if(match){
            list.push(match)
        }
    }

    let usersList = []
    for(let i =0; i<list.length; i++){
        let match2 = await Users.find({username:  list[i][0].member}, {profileimg: 1, username: 1})
        if(match2){
            usersList.push(match2)
        }
    }
  
    if(usersList.length>0){
        res.status(200).json({response: usersList})
    }else{
        res.status(404).json({response: 'No Chats Started Yet'})
    }

})

app.listen(80);

