import React, {useState, useEffect} from 'react'
import { StyleSheet, Platform, Text, TextInput, View, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import { useLogin } from '../helpers/context.js';
import {server_url} from '@env'

export default function UploadScreen({ navigation }) {
    const {user} = useLogin(); 
    const [message, setMessage] = useState('Upload Screen')
    const [error, setError] = useState(false)
    const [image, setImage] = useState('');
    const [uri, setUri] = useState('');
    const [uploaded, setUploaded] = useState(false);
    
    const UploaderScreen = () => {
        const [caption, setCaption] = useState('');
        useEffect(() => {
            navigation.addListener('focus', () => {
                setImage('')
                setCaption('')
                setUri('')
                setUploaded(false);
            });
        }, [])  

    const PickImage = async () => { 
        const granted = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(granted.granted){
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                includeBase64: true,
                includeExtra: true
            });

            if(result.error) {
                setMessage(result.error)
            }
            else if(!result.cancelled){
                if(result.uri.includes('HEIC') || result.uri.includes('heic') || result.uri.includes('heif') || result.uri.includes('heif') ){
                    setMessage("Image Type Not Support Yet")
                    setError(true)
                }
                else{
                    setUri(result.uri)
                    setImage(result)
                }
            }
        }else{
            alert('Permissions required to access camera roll.');
        }
    }

    const submitImage = () => { 
        if(user && uri && caption ){
        const newPost = {
            user: user,
            uri: uri,
            caption: caption
        }
        fetch(`${server_url}/upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPost)
        }).then(res => {
            if(res.status === 200){
                setUploaded(true)
            }
            else{
                setUploaded(false)
            }
        });
        }else{
            setMessage("Missing Credentials")
            setError(true)
        }
    }
    
    return( 
        <View style= {styles.uploadContainer}>
            <Text style = {{ color: error ? "red" : "blue", fontSize: Platform.OS === 'ios' ? 30 : 60,  margin: 15}}>{message}</Text>
            <View style={styles.imageHolder}>
                {image ? <Image source={{ uri: uri}} style={styles.uploadedImg} /> : <Text>Preview!</Text>}
            </View> 
            <Button title= "Pick an image from camera roll" onPress={PickImage} />
            <TextInput  style = {styles.input} autoCorrect={false} placeholder = "Enter a caption" maxLength={30}  onChangeText={setCaption}/>
            <Button title = "Submit" onPress = {submitImage} />
        </View>
    )
}

return(
    <View style ={styles.container}>
        {uploaded ?  <Text>Image was uploaded! </Text> : <UploaderScreen/>}
    </View>
)
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadContainer :{
    width: Platform.OS === 'ios' ?  400:  '80vw',
    height: Platform.OS === 'ios' ? 600: '85vh',
    backgroundColor: 'lightgrey',
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    marginTop: 25,
    marginBottom: 10,
    height: '5%',
    width: '80%',
    borderColor:'black',
    borderWidth: 1,
    color: 'black'
  },
  imageHolder: {
    width: Platform.OS === 'ios' ? 300 : '60vw',
    height: Platform.OS === 'ios' ? 300 : '40vh', 
    borderColor: "black", 
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadedImg: {
    height: Platform.OS === 'ios' ? 300 : '100%',
    width: Platform.OS === 'ios' ? 300 : '100%',
    resizeMode:'contain'
  }
});