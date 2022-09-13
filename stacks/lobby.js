import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import AppStack from './appStack.js'
import AuthStack from './authStack.js'
import { useLogin } from '../helpers/context.js';

const Stack = createStackNavigator();

const LobbyScreen = () =>{
  const { isLoggedIn } = useLogin();
  return (
    isLoggedIn ? <AppStack /> : <AuthStack /> 
  );
}
export default LobbyScreen;

