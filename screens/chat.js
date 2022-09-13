import React, {useEffect, useState} from 'react'
import { StyleSheet, Platform, Text, View, TextInput, Pressable, Image, ScrollView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useLogin } from '../helpers/context';
import {server_url} from '@env'

export default function ChatScreen({ navigation  }) { 
  const {user} = useLogin();
  const [searchbarHidden, setSearchbarHidden] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [noChats, setNoChats] = useState(false)
  const [chatId, setChatId] = useState(false)
  const [chatsArray, setChatsArray] = useState([])

  function fetchChats(){
    fetch(`${server_url}/getChatList/${user}`, {
      method: 'GET', 
      headers: {
        'Content-type' : 'application/json'
      }
    })
    .then(async res =>{
      if(res.status == 200){
        const response = await res.json()
        setNoChats(false)
        setChatsArray(response.response)
      }else{
        setNoChats(true)
      }
    }).finally( () =>{
      setIsLoading(false)
    }) 
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      fetchChats();  
    });
  }, []);
  
  const ChatLobby = () =>{
    const [searchName, setSearchName] = useState('')
    const [member, setMember] = useState(false)
    const [resultsProfileImg, setResultsProfileImg] =useState('')
    const [resultsFound, setResultsFound] = useState(false);
    const [searchSent, setSearchSent] = useState(false);

    function startChat(searchName){
      const members= {
          user: user,
          member: searchName
      }
      fetch(`${server_url}/createChat`, {
          method: "POST",
          headers:{
              'Content-type' : 'application/json'
          },
          body: JSON.stringify(members)
      }).then(async res =>{
          if(res.status === 200){
              const response = await res.json()
              navigation.navigate('View Screens', {
                screen: 'View Chat',
                params: {
                  chatId: response.response //chatId
                }
              }); 
          }
          if(res.status === 409){
              const response = await res.json()
              navigation.navigate('View Screens', {
                screen: 'View Chat',
                params: {
                  chatId: response.response //chatId
                }
              });
          }
      })
  }
  
  const searchUser = (req, res) => {

    const data = {
      searchName: searchName
    }
    fetch(`${server_url}/searchUser`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
      }).then(async res => {
        if(res.status === 200){
          let response = await res.json();
          setMember(response.response);
          setResultsProfileImg(response.response2)
          setResultsFound(true);
          setSearchSent(true);
        }
        else{
          setResultsFound(false);
          setSearchSent(true);
        }
      })
  }

  const ResultsFound = () =>{
    return(
      <>
        <View style = {styles.ResultsContainer} >
          <Text style= {{color: 'black', textAlign: 'center', fontSize: 15, textDecorationLine: 'underline'}}>Results</Text>
          <Pressable style = {{justifyContent:'center', alignItems: 'center', height: '80%', width: '80%', flexDirection : "row" }}  onPress={startChat(searchName)}>
            <View style = {{justifyContent:'center', alignItems: 'center', width: '40%', height: '80%', borderRadius: 30}}>
              <Image style = {{width: '100%', height: '100%', borderRadius: 50, borderColor: 'blue', borderWidth: 2}} source = {{ uri: resultsProfileImg }} />
            </View>
            <Text style= {{color: 'blue', textAlign: 'center', fontSize: 17}}>  Username: {searchName}</Text>
          </Pressable>
        </View>
        
      </>
    )
  }
  
  const getResults = () =>{
    return(
      resultsFound ? ResultsFound() : <Text style = {{fontSize: 25, marginTop: 2, color: 'red'}}> No results found! </Text>
    )
  }

    return(
      <>
       <>
        {searchbarHidden ? 
        <>
          <Text style = {{fontSize: 25, textAlign: 'center'}}>Click To Search a User!</Text>
          <Pressable style = {{width: '100%', height: '07%', justifyContent: 'center', alignItems: 'center'}} onPress= { () => {setSearchbarHidden(false)}}>
            <Ionicons name="open-outline" size = {Platform.OS === 'ios' ? 25: 30} color = 'blue'/>
          </Pressable>
        </>
          : 
          <View style={styles.container}>
              <Text style = {{fontSize: 25, textAlign: 'center', }}>Search to Start Chatting</Text>
            <View style = {styles.SearchContainer}>
              <TextInput style = {styles.Input} placeholder = "Search for a user" value = {searchName} onChangeText={setSearchName}/>
              <Pressable style = {styles.Button} onPress = {searchUser} >
                <Ionicons name="search" size = {Platform.OS === 'ios' ? 20: '29'} color = 'blue'/>
              </Pressable>
            </View>
            {searchSent ? getResults() : null } 
          </View>
        }
      </>
      <ScrollView contentContainerStyle = {styles.chatArrayContainer}>
      <Text style = {{fontSize: 25, textAlign: 'center', color: 'blue', fontWeight: 'bold', textDecorationLine: 'underline'}}>Current Chats</Text>  
      {noChats 
        ?
          <Text style = {{fontSize: 25, textAlign: 'center', marginTop: 100}}>No chats yet! </Text>
        :
          chatsArray.map( (chat, index)=>
          <Pressable key = {index} style ={styles.chatListContainer} onPress = { () => {startChat(chat[0].username)} }>
            <Image style ={styles.chatProfileimg} source = {{uri: chat[0].profileimg}}/>
            <Text style = {{fontSize: 25, textAlign: 'center'}}>  {chat[0].username}</Text>  
          </Pressable>
          )
        }
      </ScrollView> 
    </>
    )
  }

  return(
    <>
    {isLoading ? null : <ChatLobby/>}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 150,
    alignItems: 'center'
  },
  label: {
    color: "blue", 
    fontSize: 60,
    fontWeight: "bold", 
    marginBottom: 25,
    textDecorationLine: 'underline'
  },
  SearchContainer: {
    flexDirection:"row",
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgrey',
    borderRadius: 20,
    shadowColor: 'grey',
    shadowOffset: {width: -5, height: 5},
    shadowRadius: 3,
    width: Platform.OS === 'ios' ? 350 : '70%',
    height: 50
  },
  ResultsContainer:{
    height: Platform.OS === 'ios' ? 200 : '50%',
    width: '70%',
    borderRadius: 20,
    marginTop: 10,
    justifyContent:'center', 
    alignItems: 'center'
  },
  ResultsText: {
    color: 'white', 
    textAlign: 'center', 
    fontSize: 13,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10
  },
  Input: {
    width: Platform.OS === 'ios' ? 200: '40%',
    height: 30,
    borderColor:'blue',
    borderWidth: 2,
    fontSize: 15
  },
  Button : {
    height: 30,
    borderTopColor: 'blue',
    borderTopWidth: 2,
    borderBottomColor: 'blue',
    borderBottomWidth: 2,
    borderRightColor: 'blue',
    borderRightWidth: 2,
    justifyContent:'center', 
    alignItems: 'center'
  },
  Text: {
    fontsize: 30, 
    color: 'white', 
    textAlign: 'center'
  },
  chatArrayContainer:{
    marginTop: Platform.OS === 'ios' ? 40 : 40,
    height: Platform.OS === 'ios' ? 500 : '60vw'
  },
  chatListContainer: {
    height: Platform.OS === 'ios' ? 80 : 150,
    width: '100%',
    backgroundColor: 'lightgrey',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    borderTopColor: 'white',
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  chatProfileimg : {
    height: '80%',
    width: '20%',
    borderWidth: 2,
    borderColor: 'blue',
    borderRadius: 60
  }
});