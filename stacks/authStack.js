import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import LogInScreen from '../screens/login.js'
import SignUpScreen from '../screens/signup.js'
console.reportErrorsAsExceptions = false;

const Stack = createStackNavigator();

export default function AuthStack(){
    return(
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name = "Login Page" component = {LogInScreen} />
            <Stack.Screen name = "Sign Up Page" component = {SignUpScreen} />
        </Stack.Navigator>
    </NavigationContainer>
    )
}
