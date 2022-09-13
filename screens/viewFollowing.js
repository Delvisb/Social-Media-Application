import React, {useState, useEffect} from 'react'
import { StyleSheet, Platform,  Text, View, Image, ScrollView, Pressable } from 'react-native';
import {server_url} from '@env'

export default function ViewFollowingScreen({ route, navigation }) {
    const [search, setSearch] = useState( route.params.search)
    const [followingArray, setFollowingArray] = useState([])
    const [profileImgs, setProfileImgs] = useState([])
    const [noFollowing, setNoFollowing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    function fetchFollowing(){ 
        fetch(`${server_url}/getFollowing/${search}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(async res => { 
            if(res.status === 200){
                const response = await res.json();
                if(response.response.length > 0){
                    setFollowingArray(response.response)
                    setProfileImgs(response.response2)
                    setNoFollowing(false)
                }else{
                    setNoFollowing(true)
                }
            }
        }).then( () =>{
            setIsLoading(false)
        })
    }

    useEffect(() => {
        navigation.addListener('focus', () => {
            fetchFollowing();
        });
    }, [route.params.search]);

    const FollowingList = () =>{
        
        function getProfileImg(username){
            for(let i = 0; i<= profileImgs.length; i++){
                if(profileImgs[i][0].username === username){
                    return profileImgs[i][0].profileimg
                }
            }
        }

        return(
        <>
            {noFollowing 
            ? 
            <Text styles = {{fontSize: 30, justifyContent: 'center', alignItems: 'center'}}>Not Following Yet! </Text> 
            :
            <ScrollView contentContainerStyle = {styles.container}>
                <Text style ={{fontSize: 30, color: 'blue', marginBottom: 10, textDecorationLine: 'underline'}}>{followingArray.length} Following</Text>
                {followingArray.map((following, index)=>
                    <View key = {index} style = {styles.followingContainer}>
                        <Pressable style = {styles.profileViewBtn} onPress={() => {
                            navigation.navigate('View Profile', {
                                searchedUser: following.username
                            })
                        }}>
                            <Image style ={styles.resultsImage} source = {{ uri: getProfileImg(following.username) }} />
                            <Text style ={styles.resultsText}> {following.username} </Text>
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
            {isLoading ? <Text styles = {{justifyContent: 'center', alignItems: 'center'}}>LOADING...</Text> : <FollowingList/>}
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
    followingContainer :{
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
