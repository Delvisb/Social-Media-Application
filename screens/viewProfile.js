import React, {useState, useEffect} from 'react'
import { StyleSheet, Platform, Text, View, Image, FlatList, Pressable } from 'react-native';
import LogoutScreen from '../helpers/logout.js'
import { useLogin } from '../helpers/context.js';
import {server_url} from '@env'

export default function ViewProfileScreen({ route, navigation }) {
  const {user} = useLogin();
  const [search, setSearch] = useState(route.params.searchedUser)
  const [userInfo, setUserInfo] = useState([])
  const [usersPosts, setUsersPosts] = useState([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [feed, setFeed] = useState(true)
  const [isLoading, setIsLoading] = useState(true);

  function followUnFollow(search, user){  
    const followDetails = {
        userToFollow: search,
        user: user
    }
    fetch(`${server_url}/followUnfollowUser`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(followDetails)
    }).then(async res => { 
        if(res.status === 200){
            const response = await res.json();
            fetchProfile();
        }
    })
  }
  
  function fetchProfile(){
    const profile = {
      user: user,
      search: search
    }  
    fetch(`${server_url}/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile)
    }).then(async res => {  
      if(res.status === 200){
        const response = await res.json();
        setUserInfo(response.response);
        if(response.response2.length > 0){
          setUsersPosts(response.response2)
        }else{
          setFeed(false)
        }
        setIsFollowing(response.response3)
      }
    }).then(() =>{
      setIsLoading(false)
    })
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      fetchProfile();
    });
  }, [route.params.searchedUser]);
 
  const ProfileFound = () =>{
    return(
    <>
      <LogoutScreen/>
      <View  style = {styles.infoContainer}>
        <View style= {{width: '100%', height: '70%', flexDirection: 'row'}} >
          <View style = {styles.leftContainer}>
            <View style ={styles.infoProfileImgContainer}>
              <Image style = {styles.infoProfileImg} source = {{ uri: userInfo.profileimg }} />
            </View>
          </View>
          <View style = {styles.rightContainer}>
            <Text style = {{fontSize: 20, color: 'white', fontWeight: 'bold'}}>{userInfo.username}</Text>
            <Text style = {styles.infoText}>{userInfo.firstname + " " + userInfo.lastname}</Text>
            <Text style = {styles.infoText}>{userInfo.email}</Text>
            {
              user === userInfo.username ? null  : 
              <Pressable style = {{width: '80%', height: '20%', justifyContent: 'center', alignItems: 'center', margin: 10, backgroundColor: isFollowing ? "white" : "blue", borderWidth: 1, borderColor: isFollowing ? "blue" : "white"}} onPress={ () => {followUnFollow(search, user)} }>
                <Text style = {{alignItems: 'center', justifyContent: 'center', color: isFollowing ? "blue" : "white"}}>{isFollowing ? `Following`  : `Follow` }</Text> 
              </Pressable>
            }
          </View>
        </View>
        <View style = {styles.bottomContainer}>
          <Text style = {styles.infoText}>{usersPosts.length} Posts</Text>
          <Pressable style = {{marginLeft: 15, marginRight: 15}}  onPress={() => {
              navigation.navigate('View Screens', {
                screen: 'View Followers',
                params: {
                  search: search
                }
              })
            }}>
              <Text style = {styles.infoText}>{userInfo.numOfFollowers} Followers</Text>
            </Pressable>

            <Pressable onPress={() => {
              navigation.navigate('View Screens', {
                screen: 'View Following',
                params: {
                  search: search
                }
              })
            }}>
              <Text style = {styles.infoText}>{userInfo.numOfFollowing} Following</Text>
            </Pressable>

        </View>
      </View>

      { feed ? 
       <View style ={styles.container2}>
        <FlatList contentContainerStyle={styles.postsGrid}
          data={usersPosts}
          numColumns={3}         
          keyExtractor={(item, index) => item.id }
          renderItem={({ item }) => (
              <View style = {styles.imgContainer}>
                <Pressable style = {{ width: '100%', height: '100%'}} onPress={() => {
                  navigation.navigate('View Post', {
                    postId: item._id
                  })
                }}>
                <Image style = {styles.postsImg}  source = {{ uri: item.img }}  />
                </Pressable>
              </View>
          )}
        />

        </View>
        : 
        <View style = {{ marginTop: 20, justifyContent: 'center', textAlign :'center'}}>
          <Text style = {{fontSize: 18 }}>No Feed</Text>
        </View>
        }
    </>
    )
  }

  return(
    <View style={styles.container}>
      {isLoading ? <Text styles = {{justifyContent: 'center', alignItems: 'center'}}>LOADING...</Text> : <ProfileFound/>}
    </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  label: {
    color: "blue", 
    fontSize: 60,
    fontWeight: "bold", 
    marginBottom: 25,
    textDecorationLine: 'underline'
  },
  infoContainer : {
    marginTop: 10,
    backgroundColor: "lightgrey",
    height:  Platform.OS === 'ios' ? 200 : '25vh',
    width: Platform.OS === 'ios' ? 330 : '70vw',
    borderRadius: 20,
    shadowColor: 'lightgrey',
    shadowOffset: {width: -5, height: 5},
    shadowRadius: 3
  },
  leftContainer :{
    width: '40%',
    height: '100%',
    alignItems: "center",
    justifyContent: 'center'
  },
  infoProfileImgContainer : {
    borderRadius: 50,
    borderColor: 'blue',
    borderWidth: 3,
    width: Platform.OS === 'ios' ? '90%' : '50%',
    height: Platform.OS === 'ios' ? '90%' : '95%'
  },
  infoProfileImg: {
    borderRadius: 50,
    width: '100%',
    height: '100%'
  },
  rightContainer :{
    width: '60%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoText: {
    fontSize: 15,
    color: 'white'
  },
  bottomContainer: {
    height: '30%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10
  },
  profileImgContainer : {
    height: '20%',
    width: '15%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 25,
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImg :{
    height: '100%',
    width: '100%',
    borderRadius: 25
  },
  container2 : {
    borderRadius: 25,
    shadowColor: 'lightgrey',
    shadowOffset: {width: -5, height: 5},
    shadowRadius: 3,
    backgroundColor: 'lightgrey',
    marginTop: 10
  },
  postsGrid : {
    height: Platform.OS === 'ios' ? 400 :'60vh',
    width: Platform.OS === 'ios' ? 350 : '70vw',
    padding: 10
  },
  imgContainer: {
    height:  Platform.OS === 'ios' ? 150 : '30vh',
    width: '31%',
    backgroundColor: 'white',
    margin: 1,
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1
  },
  postsImg: { 
    borderWidth: 1, 
    borderColor: 'grey', 
    width: '100%',
    height: '100%',
    resizeMode:'contain'
  }
});
