import React, {useState, useEffect} from 'react'
import { StyleSheet, Platform,  Text, View, Image, ScrollView, Pressable , TextInput} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useLogin } from '../helpers/context.js';
import {server_url} from '@env'

export default function ViewChatRoomScreen({ route, navigation }){
    const {user} = useLogin();
    const [chatId, setChatId] = useState(route.params.chatId) 
    const [noMessages, setNoMessages] = useState(false)
    const [messagesArray, setMessageArray] = useState(false)
    const [membersArray, setMembersArray] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    function fetchChat(){ 
        fetch(`${server_url}/getChat/${chatId}`,{
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            }
        }).then(async res => { 
            if(res.status === 200){
                const response = await res.json();
                setMembersArray(response.members)
                if(response.messages.length > 0){
                    setMessageArray(response.messages)
                    setNoMessages(false)
                }else{
                    setNoMessages(true)
                }
            }
        }).finally( () =>{
            setIsLoading(false)
        })
    }

    useEffect(() => {
        navigation.addListener('focus', () => {
            fetchChat();  
        });
     
    }, [chatId]);

    const Chat = () => {
        const [message, setMessage] = useState('')

        function getRecieverName(){
            console.log()
            for(let i = 0; i<= membersArray.length; i++){
                if(membersArray[i][0].username !== user){
                    return membersArray[i][0].username
                }
            }
        }
        function getRecieverProfileImg(){
            for(let i = 0; i<= membersArray.length; i++){
                if(membersArray[i][0].username !== user){
                    return membersArray[i][0].profileimg
                }
            }
        }
        function addMessage(){
            const messageDetails = {
                chatId: chatId,
                sentBy: user,
                message: message
            }          
            fetch(`${server_url}/addMessage`,{
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageDetails)
            }).then(async res => { 
                if(res.status === 200){
                    fetchChat();
                }
            })
            .then( () =>{
                setMessage('')
            })
        }

        return(
        <View style ={styles.chatContainer}>            
            <View style ={styles.headerContainer}>
                <Image style ={styles.chatterProfileImg} source = {{ uri: getRecieverProfileImg() }} /> 
                <View style ={{justifyContent: 'center', alignItems: 'center', width: '60%'}}>
                    <Text style ={styles.chatterUsername}>{getRecieverName()}</Text>
                </View>
            </View>
            <View style ={styles.messageAreaContainer}>
                <ScrollView contentContainerStyle = {styles.messageAreaContainer2}>
                {noMessages 
                    ?
                    <Text style = {{fontSize: 25, textAlign: 'center', marginTop: 300}}>No Messages </Text>
                    :
                    messagesArray.map( (message, index)=>
                    message.sentBy === user ? 
                        <View key ={index} style = {styles.messagesContainer1} >
                        <ScrollView contentContainerStyle= {styles.sentMessage}> 
                            <Text style = {styles.message}>{message.sentBy}: {message.message}</Text> 
                        </ScrollView>
                        </View>
                        :
                        <View key ={index}  style = {styles.messagesContainer2} >
                            <ScrollView  contentContainerStyle= {styles.recievedMessage}>
                                <Text style = {styles.message}>{message.sentBy}: {message.message}</Text>
                            </ScrollView>
                        </View>
                    )
                }
                </ScrollView>   
            </View>
            <View style = {styles.messageSenderContainer}>
                <View style = {styles.messageSenderContainer2}>
                    <TextInput placeholder = "Type a message" style = {styles.messageInput} onChangeText= {setMessage}/> 
                    <Pressable style = {styles.messageSenderButton} onPress = {addMessage}>
                        <Ionicons name="send-sharp" size = {Platform.OS === 'ios' ? 20: 30} color = 'blue'/>
                    </Pressable>
                </View>
            </View>
        </View>  
        )
    }

    return(
        <View style={styles.page}>
            {isLoading ? <Text styles = {{justifyContent: 'center', alignItems: 'center'}}>LOADING...</Text> : <Chat/>}
        </View>
    );
};

const styles = StyleSheet.create({
    page: {
        height: Platform.OS === 'ios' ? 750 : '100vh',
        width: Platform.OS === 'ios' ? 390 : '100vw',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    chatContainer:{
        height: '100%',
        width: '100%'
    },
    headerContainer: {
        width: '100%',
        height: '10%',
        backgroundColor: 'blue',
        alignItems: 'center',
        flexDirection: 'row'
    },
    chatterProfileImg: {
        width:  Platform.OS === 'ios' ? 80 : '10%',
        height: '90%',
        borderColor: 'white',
        borderRadius: 60,
        borderWidth: 2,
        marginLeft: 5
    },
    chatterUsername : {
        fontSize: 25,
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold'
    },
    messageAreaContainer: {
        height: Platform.OS === 'ios' ? 530 : '70vh',
        width:  '100%',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    messageAreaContainer2: {
        height: Platform.OS === 'ios' ? 525 : '60vh',
        width: '100%',
        backgroundColor: 'white',
        paddingTop: 5,
        paddingBottom: 5
    },
    messagesContainer1:{
        marginLeft: Platform.OS === 'ios' ? '40%' : '60%',
        maxWidth:  Platform.OS === 'ios' ? 200 : 250,
        maxHeight: Platform.OS === 'ios' ? 80 : 130,
        marginTop: 2, 
        marginBottom: 2,
        backgroundColor: 'blue',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'black',
    },
    messagesContainer2:{
        marginLeft: Platform.OS === 'ios' ? '5%' : '10%',
        marginTop: 3, 
        marginBottom: 1,
        maxWidth:  Platform.OS === 'ios' ? 200 : 250,
        maxHeight: Platform.OS === 'ios' ? 80 : 130,
        backgroundColor: 'green',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'black',
    },
    sentMessage: {
        padding: 10,
        alignItems: 'center'
    },
    recievedMessage:{
        padding: 10,
        alignItems: 'center'
    },
    message: {
        fontSize: 15
    },
    messageUsername: {
        marginTop: 2,
        fontSize: 15
    },
    messageSenderContainer: {
        width: '100%',
        height: Platform.OS === 'ios' ? '20%': '15vh',
        backgroundColor: 'blue',
        alignItems: 'center'
    },
    messageSenderContainer2: {
        width: '80%',
        height: '40%',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'black',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginTop: 10
    },
    messageInput: {
        fontSize: 15,
        padding: 1,
        width: '85%',
        height: '90%',
        color: 'blue'
    },
    messageSenderButton : {
        width: '10%',
        height: '90%',
        justifyContent: 'center',
        alignItems: 'center'
    }
    
});
