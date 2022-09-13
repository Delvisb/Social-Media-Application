import React, {useState, useEffect} from 'react'
import { StyleSheet, Platform,  Text, View, Image, ScrollView, Pressable } from 'react-native';
import {server_url} from '@env'

export default function ViewFollowersScreen({ route, navigation }) {
    const [imgId, setImgId] = useState(route.params.imgId)
    const [profileImgs, setProfileImgs] = useState([])
    const [likesArray, setLikesArray] = useState([])
    const [noLikes, setNoLikes] = useState(false)
    const [isLoading, setIsLoading] = useState(true);

    function fetchLikes(){  

        fetch(`${server_url}/getLikes/${imgId}`,{
            method: 'GET',
            headers: {
            'Content-Type': 'application/jso2n',
            }
        }).then(async res => { 
            if(res.status === 200){
                const response = await res.json();
                setLikesArray(response.response)
                if(response.response.length > 0){
                    setLikesArray(response.response)
                    setProfileImgs(response.response2)
                    setNoLikes(false)
                }else{
                    setNoLikes(true)
                }
            }
        }).then( () =>{
            setIsLoading(false)
        })
    }

    useEffect(() => {
        navigation.addListener('focus', () => {
            fetchLikes();
        });
    }, [imgId]);

    const LikesList = () =>{

        function getLikerProfileImg(likedBy){
            for(let i = 0; i<= profileImgs.length; i++){
                if(profileImgs[i][0].username === likedBy){
                    return profileImgs[i][0].profileimg
                }
            }
        }
        return(
        <>
            {noLikes ? 

            <Text styles = {{fontSize: 30, justifyContent: 'center', alignItems: 'center'}}>No Likes Yet! </Text> 
            : 
            <ScrollView contentContainerStyle = {styles.container}>
                <Text style ={{fontSize: 30, color: 'blue', marginBottom: 10, textDecorationLine: 'underline'}}>{likesArray.length} Likes</Text> 
                {likesArray.map((liker, index)=>
                    <View key = {index} style = {styles.likesContainer}>
                        <Pressable style = {styles.profileViewBtn} onPress={() => {
                            navigation.navigate('View Profile', {
                            searchedUser: liker.likedBy
                            })
                        }}>
                            <Image style ={styles.resultsImage} source = {{ uri: getLikerProfileImg(liker.likedBy) }} />
                            <Text style ={styles.resultsText}> {liker.likedBy} </Text>
                        </Pressable>
                    </View>
                  
                )}
            </ScrollView>
            }
        </>
        )
    }

    return(
        <View style={styles.page}>
            {isLoading ? <Text styles = {{justifyContent: 'center', alignItems: 'center'}}>LOADING...</Text> : <LikesList/>}
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
    likesContainer :{
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
    }
    
});
