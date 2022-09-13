import React, {useState, useEffect} from 'react'
import { StyleSheet, Platform,  Text, View, Image, FlatList, Pressable } from 'react-native';
import {server_url} from '@env'
import { ScrollView } from 'react-native-gesture-handler';

export default function ViewCommentsScreen({ route, navigation }) {
    const [imgId, setImgId] = useState(route.params.imgId)
    const [profileImgs, setProfileImgs] = useState([])
    const [commentsArray, setCommentsArray] = useState([])
    const [noComments, setNoComments] = useState(false)
    const [isLoading, setIsLoading] = useState(true);

    function fetchComments(){ 
        fetch(`${server_url}/getComments/${imgId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(async res => { 
            if(res.status === 200){
                const response = await res.json();
                if(response.response.length > 0){
                    setCommentsArray(response.response)
                    setProfileImgs(response.response2)
                    setNoComments(false)
                }else{
                    setNoComments(true)
                }
            }
        }).then( () =>{
            setIsLoading(false)
        })
    }

    useEffect(() => {
        navigation.addListener('focus', () => {
            fetchComments();
        });
    }, [route.params.imgId]);

    const CommenterList = () =>{

        //Assigning the user's profile image to the view
        function getCommenterProfileImg(commentedBy){
            for(let i = 0; i<= profileImgs.length; i++){
                if(profileImgs[i][0].username === commentedBy){
                    return profileImgs[i][0].profileimg
                }
            }
        }

    return(
        <>
            {noComments 
            ? 
            <Text style = {{fontSize: 25, justifyContent: 'center', alignItems: 'center'}}>No Comments Yet! </Text> 
            :
            <ScrollView contentContainerStyle = {styles.container}>
                 <Text style ={{fontSize: 30, color: 'blue', marginBottom: 10, textDecorationLine: 'underline'}}>{commentsArray.length} Comments</Text> 
                {
                commentsArray.map((item, index) =>
                    <View key = {index} style = {styles.commenterContainer}>
                        <Pressable style = {styles.profileViewBtn} onPress={() => {
                            navigation.navigate('View Profile', {
                                searchedUser: item.commentedBy
                            })
                        }}>
                        <Image style ={styles.resultsImage} source = {{ uri: getCommenterProfileImg(item.commentedBy) }} />
                            <View style= {{alignItems: 'center'}}>
                                <Text style ={styles.resultsText}> {item.commentedBy} </Text>
                                <Text style ={styles.resultsComment}>{item.comment}</Text>
                            </View>
                        </Pressable>
                    </View>

                )
            }
            </ScrollView>
            }
        </>
    )}

    return(
        <View style={styles.page}>
            {isLoading ? <Text styles = {{justifyContent: 'center', alignItems: 'center'}}>LOADING...</Text> : <CommenterList/>}
        </View>
    );
};

const styles = StyleSheet.create({
    page: {
        height: Platform.OS === 'ios' ? 750 : '100vh',
        width: Platform.OS === 'ios' ? 400 : '100vw',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    feedText: {
        fontSize: 20,
        color: "black"
    },
    container: {
        height: Platform.OS === 'ios' ? 725 : '100vh',
        width: Platform.OS === 'ios' ?  400 : '70vw',
        alignItems: 'center',
        backgroundColor: 'lightgrey'
    },
    commenterContainer :{
        height: Platform.OS === 'ios' ? 150 : '15%',
        width: Platform.OS === 'ios' ? 300 : '40%',
        borderWidth: 1,
        borderColor: "Blue",
        marginTop: 10
    },
    profileViewBtn:{
        width: '100%', 
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    resultsImage:{
        height: '90%',
        width: '40%',
        borderRadius: 60,
        borderWidth: 1,
        borderColor: 'blue'
    },
    resultsText:{
        fontSize: 25
    },
    resultsComment :{
        fontSize: 18
    } 
});