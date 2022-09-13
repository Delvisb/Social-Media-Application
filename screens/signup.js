import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react'
import { StyleSheet, Platform, Pressable, TextInput, Text, Image, View, Button, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import {server_url} from '@env'


export default function SignUpScreen({ navigation }){ 
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [image, setImage] = useState('');
    const [uri, setUri] = useState('');
    const [sent, setSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')

    const PickImage = async () =>{
      const granted = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(granted.granted){
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true
          });
          if(!result.cancelled){
            if(result.uri.includes('HEIC') || result.uri.includes('heic') || result.uri.includes('heif') || result.uri.includes('heif') ){
              setErrorMessage("Image type not supported yet")
              setSent(true);
            }else{
              setImage(result);
              setUri(result.uri)
            }
          }    
        }else{
          alert('Permissions required to access camera roll.');
        }
    }
    function SignUp(){
        const credentials = {
            username,
            firstname,
            lastname,
            email,
            password,
            uri
        }
        fetch(`${server_url}}/register`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        }).then(async res => {
            try {
                const responseMessage = await res.json();
                if(res.status === 200){
                  navigation.navigate('Login Page')
                }else{
                  setSent(true);
                  setErrorMessage(responseMessage.message)
                }
            } 
            catch(err){
                console.log(err)
            }
        });
    }

    const getMessage = () => {
      return errorMessage;
    }
  
    return(
      <View style = {styles.container}>
          <Text style = {styles.label}>Capture</Text>
            <ScrollView contentContainerStyle ={styles.form}>
              <Text style = {{fontSize: 30, color: 'red'}}> {sent ? getMessage() : null} </Text>   
              <Text style = {{ fontSize: 30, color: 'black', marginBottom: 20}} >Sign Up</Text>
              <Text style = {styles.text}>Username:</Text>
              <TextInput style = {styles.inputs} placeholder = "Username " maxLength={40} onChangeText={setUsername}/>
              <Text style = {styles.text}>First Name:</Text>
              <TextInput style = {styles.inputs} placeholder = "First Name" maxLength={40} onChangeText={setFirstname}/>
              <Text style = {styles.text}>Last Name:</Text>
              <TextInput style = {styles.inputs} placeholder = "Last Name" maxLength={40} onChangeText={setLastname}/>
              <Text  style = {styles.text}>Email: </Text>
              <TextInput style = {styles.inputs} placeholder = "Email" maxLength={40} onChangeText={setEmail}/>
              <Text  style = {styles.text}>Password: </Text>
              <TextInput style = {styles.inputs}  secureTextEntry={true} placeholder = "Password" onChangeText={setPassword}/>
              
              <View style = {{alignItems: 'center', marginTop: 10}}>
                {image ? <Image source={{ uri: uri}} style={styles.profilePicture}/> : null}
                <Button title= "Choose your profile picture" onPress={PickImage} />
              </View>

              <Pressable style = {styles.signUpBtn} title= "Sign Up" onPress = {SignUp} >
                <Text style = {{fontSize: 15, color: 'white', textAlign: 'center'}}>Sign Up</Text>
              </Pressable>
             
              <View >
                <Pressable style = {{marginTop: 20, marginBottom: 20, height: '15%', width: '100%'}}  onPress = { () => navigation.navigate('Login Page')} >
                  <Text style = {{color: 'blue', textDecorationLine: 'underline'}} >Login Here</Text>
                </Pressable>
                <StatusBar style="auto" />
              </View>
            </ScrollView>
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
    paddingTop: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgrey',
    color: 'white',
    width: Platform.OS === 'ios' ? 300 :  "80vw",
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
  signUpBtn: { 
    marginTop: 20,
    width: Platform.OS === 'ios' ? 230 : '15%',
    height: Platform.OS === 'ios' ? 30 :  '5%',
    borderWidth: 1,
    backgroundColor: 'blue',
    borderColor: 'white',
    borderWidth: 1,
    alignText: 'center',
    justifyContent:  'center'
  },
  profilePicture :{
    width: 200, 
    height: 200, 
    borderRadius: 20, 
    borderWidth: 2, 
    borderColor: 'blue' 
  }
});