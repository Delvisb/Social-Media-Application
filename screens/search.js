import React, {useState} from 'react'
import { StyleSheet, Platform, Text, View, TextInput, Pressable, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {server_url} from '@env'

export default function SearchScreen({ route, navigation  }) { 
  const [searchName, setSearchName] = useState('')
  const [resultsFound, setResultsFound] = useState(false);
  const [searchSent, setSearchSent] = useState(false);
  const [resultsUsername, setResultsUsername] = useState('')
  const [resultsProfileImg, setResultsProfileImg] =useState('')
  
  navigation.addListener('focus', () => {
    setSearchName('')
    setResultsFound(false)
    setSearchSent(false)
    setResultsUsername('');
  });
  
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
          setResultsUsername(response.response);
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
          <Pressable style = {{justifyContent:'center', alignItems: 'center', height: '80%', width: '80%', flexDirection : "row" }}  onPress={() => {
              navigation.navigate('View Screens', {
                screen: 'View Profile',
                params: {
                  searchedUser: resultsUsername
                }
              }); 
            }} >
            <View style = {{justifyContent:'center', alignItems: 'center', width: '40%', height: '80%', borderRadius: 30}}>
              <Image style = {{width: '100%', height: '100%', borderRadius: 50, borderColor: 'blue', borderWidth: 2}} source = {{ uri: resultsProfileImg }} />
            </View>
            <Text style= {{color: 'blue', textAlign: 'center', fontSize: 17}}>  Username: {resultsUsername}</Text>
          </Pressable>
        </View>
        
      </>
    )
  }

  const getResults = () =>{
    return(
      resultsFound ? ResultsFound() : <Text style = {{fontSize: 25, marginTop: 300}}> No results found! </Text>
    )
  }

  return(
      <View style={styles.container}>
        <View style = {styles.SearchContainer}>
          <TextInput style = {styles.Input} placeholder = "Search for a user" value = {searchName} onChangeText={setSearchName}/>
          <Pressable style = {styles.Button} onPress = {searchUser} >
            <Ionicons name="search" size = {Platform.OS === 'ios' ? 20: '29'} color = 'black'/>
          </Pressable>
        </View>
        {searchSent ? getResults() : null }
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: 'lightgrey',
    height: '20%',
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
    borderColor:'black',
    borderWidth: 2,
    fontSize: 15
  },
  Button : {
    height: 30,
    borderTopColor: 'black',
    borderTopWidth: 2,
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    borderRightColor: 'black',
    borderRightWidth: 2,
    justifyContent:'center', 
    alignItems: 'center'
  },
  Text: {
    fontsize: 30, 
    color: 'white', 
    textAlign: 'center'
  }
});