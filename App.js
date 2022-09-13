import React from 'react';
console.reportErrorsAsExceptions = false;
import LoginProvider from './helpers/context.js';
import LobbyScreen from './stacks/lobby.js'


export default function App() {
  return (
    <LoginProvider>
      <LobbyScreen/> 
    </LoginProvider>
  )
}

