import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/home.js'
import UploadScreen from '../screens/upload.js'
import SearchScreen from '../screens/search.js'
import ProfileScreen from '../screens/profile.js' 
import ChatScreen from '../screens/chat.js'

import ViewProfileScreen from '../screens/viewProfile.js'
import ViewPostScreen from '../screens/viewPost.js'
import ViewFollowersScreen from '../screens/viewFollowers.js'
import ViewFollowingScreen from '../screens/viewFollowing.js';
import ViewLikesScreen from '../screens/viewLikes.js'
import ViewCommentsScreen from '../screens/viewComments.js';
import ViewChatRoomScreen from '../screens/viewChat.js'


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ViewScreens(){
  return(
    <Stack.Navigator>
      <Stack.Screen name = 'View Post' component = {ViewPostScreen} />
      <Stack.Screen name = 'View Profile' component = {ViewProfileScreen} />
      <Stack.Screen name = "View Followers" component = {ViewFollowersScreen} />
      <Stack.Screen name = "View Following" component={ViewFollowingScreen} />
      <Stack.Screen name = 'View Likes' component={ViewLikesScreen} />
      <Stack.Screen name= 'View Comments' component={ViewCommentsScreen} />
      <Stack.Screen name = 'View Chat' component = {ViewChatRoomScreen} />
    </Stack.Navigator>
  )
}

function MainScreens(){
  return(
    <Tab.Navigator 
        screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
            if (route.name === 'Home') {
              iconName = focused
                ? 'home'
                : 'home';
            } else if (route.name === 'Upload') {
              iconName = focused ? 'cloud-upload' : 'cloud-upload';
            } else if (route.name === 'Search') {
              iconName = focused ? 'search' : 'search';
            }else if (route.name === 'Chat') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles';
            } 
            else{
              iconName = focused ? 'body' : 'body';
            }
            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'black',
        })}
        >
          <Tab.Screen name = "Home" component = {HomeScreen} />
          <Tab.Screen name = "Upload" component = {UploadScreen} />
          <Tab.Screen name = "Search" component = {SearchScreen} />
          <Tab.Screen name = "Chat" component = {ChatScreen} />
          <Tab.Screen name = "Profile" component = {ProfileScreen} />
      </Tab.Navigator> 
  )
}

export default function AppStack(){
    return(
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
            headerShown: false
          }}>
          <Stack.Screen name = "Main Screens" component = {MainScreens} />
          <Stack.Screen name = "View Screens" component = {ViewScreens} />
        </Stack.Navigator>
    </NavigationContainer>
  )
} 
