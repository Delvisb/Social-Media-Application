import React, {useState, useEffect} from 'react'
import { StyleSheet, Platform, Text, View, Image, Pressable, ScrollView, TextInput} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useLogin } from '../helpers/context.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {server_url} from '@env'

export default function HomeScreen({ route, navigation }) { 
  const {user} = useLogin();
  const [isLoading, setIsLoading] = useState(true);
  const [noFeed, setNoFeed] = useState(true)
  const [postsArray, setPostsArray] = useState([]);
  const [postsLikesArray, setPostsLikesArray] = useState([])
  const isfocused = useIsFocused();
  
  //Gets all posts from the database
  function fetchPosts(){
    fetch(`${server_url}/getPosts`,{
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(async res => {
      if(res.status === 200){
        const response = await res.json();
        setPostsArray(response.response)
        setPostsLikesArray(response.response2)
        setNoFeed(false)
      }else{
        setNoFeed(true)
      }
    }).finally( () =>{
      setIsLoading(false)
    })
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      fetchPosts();
    }); 
  }, []);

  const LobbyScreen = () =>{
    const [comment, setComment] = useState('')

    //function for adding comments to a post
    function addComment(_id, comment){
      const commentDetails = {
        imgId: _id,
        user: user,
        comment: comment
      }

      fetch(`${server_url}/addComment`,{
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentDetails)
      })
      .then(async res => {
        if(res.status === 200){
          fetchPosts();
        }
      })
    }
    
    //function for liking and unliking images
    function likeUnlikeImg(_id){
      const likedImg = {
        id: _id,
        user: user
      }
      fetch(`${server_url}/likeUnlikeImg`,{
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(likedImg)
      })
      .then(async res => {
        if(res.status === 200){
          fetchPosts();
        }
      })
    }
    
    //function for displaying a red or white heart 
    function displayLikes(_id, user){
      const liked = postsLikesArray.find(
          item2 => item2.imgId === _id && item2.likedBy  === user
      );
      if(liked) {
        return true;
      }else{
        return false;
      }
    }
    return(
      <>
      {noFeed ? 
        <View style= {{justifyContent: 'center', alignItems: 'center'}} >
          <Text style = {{fontSize: 25, marginTop: 300}}>No New Feed! </Text>
        </View> 
          : 
        <View style ={styles.page}>
          <ScrollView contentContainerStyle = {styles.container} >
          {
          postsArray.map((item, index)=>
            <View key={index} style = {styles.postContainer}>
              <Pressable style= {styles.headerBtn} onPress={() => {
                  navigation.navigate('View Screens', {
                    screen: 'View Profile',
                    params: {
                      searchedUser: item.username
                    }
                  }); 
                }}>
              <View style = {styles.profileImgContainer}>
                <Image style = {styles.profileImg}  source = {{ uri: item.profileimg }}  />
              </View>
              <Text style={styles.postsUsername}>{item.username}</Text>
              </Pressable>

              <View style = {styles.dataContainer1}>
                <View style = {styles.imgContainer}>
                  <Image style = {styles.postsImg}  source = {{ uri: item.img }}  />
                </View>
              </View> 
              <View style={styles.dataContainer2}>
                <View style = {{marginLeft: 10, flexDirection: 'row', alignItems: 'center'}}>
                  <Pressable style = {{height: 30, width: 30}} onPress = { () => likeUnlikeImg(item._id)} >
                    <Ionicons name= "heart" color = {displayLikes(item._id, user) ? 'red' : 'white'} size ={ Platform.OS === 'ios' ?  23 :  30} />     
                  </Pressable>
                  <Pressable onPress={() => {
                    navigation.navigate('View Screens', {
                      screen: 'View Likes',
                      params: {
                        imgId: item._id
                      }
                    }); 
                  }}>
                    <Text style = {{marginLeft: 20, color: 'white'}}>Likes: {item.numOfLikes}</Text>
                  </Pressable>

                  <Pressable onPress={() => {
                    navigation.navigate('View Screens', {
                      screen: 'View Comments',
                      params: {
                        imgId: item._id
                      }
                    }); 
                  }}>
                    <Text style = {{marginLeft: 20, color: 'white'}}>Comments: {item.numOfComments}</Text>
                  </Pressable>
                </View>
                <View style = {styles.commentContainer}>
                  <View style = {styles.commentContainer2}>
                    <TextInput style ={styles.commentInput} placeholder='Enter a comment' maxLength={30} onChangeText = {setComment}/>
                    <Pressable style = {styles.commentBtn} placeholder ="Send" onPress = { () => {addComment(item._id, comment)}}>
                      <Ionicons name="send" color = 'blue' size ={ Platform.OS === 'ios' ? 20 : 25} />
                    </Pressable>
                  </View>
                </View> 
                <Text style={styles.postsCaption}>{item.caption}</Text>
              </View> 
            </View>
          )
        }
          </ScrollView>
        </View>
        }
      </>
    )
  }

  const AwaitingScreen = () =>{
    return(
      <View style = {{alignItems: 'center',justifyContent: 'center'}}>
        {isLoading ? <Text style = {{fontSize: 25,  marginTop: 300}}>Still Loading... </Text> : <LobbyScreen/>}
      </View>
    )
  }

  return(
    <>
      {isfocused ?  <AwaitingScreen/> : null}
    </>
  );
};

const styles = StyleSheet.create({
  page:{
    height: Platform.OS === 'ios' ? 650 :  "85vh",
    width: Platform.OS === 'ios' ? 390 :  "100vw",
    alignItems: "center",
    backgroundColor: 'lightgrey'
  },
  container: {
    width: Platform.OS === 'ios' ?  350 :  "100vw",
    alignItems: 'center',
    backgroundColor: 'lightgrey'
  },
  postContainer: {
    borderColor: 'black', 
    borderWidth: 2, 
    width: Platform.OS === 'ios' ? 300 : '60%',
    height: Platform.OS === 'ios' ? 450 : '65vh',
    backgroundColor: 'blue',
    marginTop: 15
  },
  headerBtn: {
    height: Platform.OS === 'ios' ? '20%' : '20%',
    width: Platform.OS === 'ios' ? '60%' : '100%',
    alignItems: Platform.OS === 'ios' ? null : 'center',
    flexDirection: Platform.OS === 'ios' ? null : 'row'
  },
  dataContainer1: {
    alignItems: 'center',
    justifyContent: 'center',
    height: Platform.OS === 'ios' ? '55%' : '55%',
    width: '100%',
    backgroundColor: 'white',
  },
  profileImgContainer : {
    height: Platform.OS === 'ios' ? 65 : '90%',
    width: Platform.OS === 'ios' ? 65 : '20%',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 30,
    marginLeft: 5,
    alignItems: 'center',
  },
  profileImg :{
    height: '100%',
    width: '100%',
    borderRadius: 30
  },
  dataContainer2:{
    height: Platform.OS === 'ios' ? '20%' : '15%',
    width: '100%'
  },
  imgContainer: {
    width: '80%',
    height: '80%',
    marginTop: 10
  },
  postsImg: { 
    borderWidth: 1, 
    borderColor: 'blue', 
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  postsUsername : {
    color: "white", 
    fontSize: Platform.OS === 'ios' ? 18 : 20,
    fontWeight: 'bold',
    marginLeft: 5
  },
  postsCaption : {
    marginTop: 10,
    color: "white", 
    fontSize: 18,
    textAlign: 'center'
  },
  feedText : {
    color: "black", 
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center'
  },
  commentContainer : {
    width: '100%',
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentContainer2: {
    flexDirection :'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 30,
    backgroundColor: 'white',
    width: '80%',
    height: '80%'
  },
  commentInput: {
    width: '80%',
    height: '85%',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 15,
    color: 'black',
    marginRight: 2
  },
  commentBtn : {
    width: '10%',
    height: '80%',
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center', 
    alignItems: 'center', 
  }
});