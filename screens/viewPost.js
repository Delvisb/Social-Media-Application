import React, {useState, useEffect} from 'react'
import { StyleSheet, Platform, Text, View, Image, Pressable} from 'react-native';
import {server_url} from '@env'

export default function ViewPostScreen({ route, navigation }) {
  const [postId, setPostId] = useState(route.params.postId)
  const [userPost, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true);

  function fetchPost(){
    fetch(`${server_url}/getPost/${postId}`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(async res => {  
      if(res.status === 200){
        const response = await res.json();
        setPosts(response.response);
      }
    }).then(() =>{
      setIsLoading(false)
    })
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      fetchPost();
    }); 
  }, []);

  const PostFound = () =>{
    return(
      <View style = {styles.container}>
      <View style = {styles.postContainer}>
        <View style = {{width: '100%', height: '20%', flexDirection: 'row', alignItems: 'center'}}>
          <View style = {styles.profileImgContainer}>
            <Image style = {styles.profileImg}  source = {{ uri: userPost.profileimg }}  />
          </View>
          <Pressable style = {{ width: '70%'}} onPress={() => {
              navigation.navigate('View Screens', {
                screen: 'View Profile',
                params: {
                  searchedUser: userPost.username
                }
              }); 
            }}>
            <Text style={styles.postsUsername}>{userPost.username}</Text>
          </Pressable>
        </View>


        <View style = {styles.dataContainer1}>
          <View style = {styles.imgContainer}>
            <Image style = {styles.postsImg}  source = {{ uri: userPost.img }}  />
          </View>
        </View> 

        <View style={styles.dataContainer2}>
          <Text style={styles.postsCaption}>{userPost.caption}</Text>
        </View> 
      </View> 
    </View>
    )
  }

  return(
    <View style={styles.container}>
      {isLoading ? <Text styles = {{justifyContent: 'center', alignItems: 'center'}}>LOADING...</Text> : <PostFound/>}
    </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor : 'lightgrey'
  },
  postContainer: {
    borderColor: 'black', 
    borderWidth: 2, 
    width: Platform.OS === 'ios' ? 300 : '60vw',
    height: Platform.OS === 'ios' ? 400 : '70vh',
    backgroundColor: 'blue',
    marginTop: 15
  },
  dataContainer1: {
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
    height: '70%',
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImg :{
    height: '100%',
    width: '100%',
    borderRadius: 30
  },
  dataContainer2:{
    height: '10%',
    width: '100%',
    justifyContent: 'center'
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
  }
});