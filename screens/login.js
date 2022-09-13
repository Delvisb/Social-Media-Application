import React, {useState} from 'react'
import { StyleSheet, Pressable, TextInput, Text, View, Alert} from 'react-native';
import { useLogin } from '../helpers/context.js';
import {server_url} from '@env'

export default function LogInScreen({ navigation }) { 
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')
  const { setIsLoggedIn, setUser } = useLogin();

  function signIn(){
    const signinInfo = {
      username,
      password
    }
    fetch(`${server_url}/login`,{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(signinInfo)
    }).then(async res => { 
      try {
        const responseMessage = await res.json();
        if(res.status === 200){
          setUser(username);
          setIsLoggedIn(true);
        }
        else{
          setIsLoggedIn(false);
          setErrors(true);
          setErrorMessage(responseMessage.message)
        }
      } 
      catch(err){
        setErrorMessage(err)
      }
    });
  }
  
  const getError = () => {
    return errorMessage;
  }
  
  return(
    <View style={styles.container}>
    <Text style = {styles.label}>Capture</Text>
      <View style ={styles.form}>
        <Text style = {{fontSize: 30, color: 'red'}}> {errors ? getError() : null} </Text>    
        <Text style = {{fontSize: 30, color: 'black', marginBottom: 20}} > Sign In </Text>
        <Text style = {styles.text} >Username: </Text>
        <TextInput style = {styles.inputs} placeholder = "Username" onChangeText={setUserName}/>
        <Text  style = {styles.text}>Password: </Text>
        <TextInput style = {styles.inputs}  secureTextEntry={true} placeholder = "Password" onChangeText={setPassword}/>
        
        <Pressable style = {styles.loginBtn} onPress = {() => signIn() } >
          <Text style = {{fontSize: 15, color: 'white', textAlign: 'center'}}>Login</Text>
        </Pressable>

        <View>
          <Pressable style = {{marginTop: 20, height: '20%', width: '100%'}} onPress = { () => navigation.navigate('Sign Up Page')} >
            <Text style = {{color: 'blue', textDecorationLine: 'underline'}} >Sign Up Here</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center', 
  },
  form : {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgrey',
    color: 'white',
    height: '60%',
    width: '80%',
    borderRadius: 20
  },
  label: {
    color: "blue", 
    fontSize: 60,
    fontWeight: 'bold', 
    marginBottom: 25,
    textDecorationLine: 'underline',
    textAlign: 'center'
  },
  inputs: {
    height: '5%',
    width: '80%',
    borderColor:'black',
    borderWidth: 1,
    color: 'black'
  },
  text: {
    fontSize: 30,
    color: 'black',
  },
  loginBtn: { 
    marginTop: 20,
    width: 120,
    height: 25,
    borderWidth: 1,
    backgroundColor: 'blue',
    borderColor: 'white',
    borderWidth: 1
    }
});