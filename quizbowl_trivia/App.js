import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TextInput, Button,Alert } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from './app/screens/WelcomeScreen';
import SettingsScreen from './app/screens/SettingsScreen';
import GameScreen from './app/screens/GameScreen';
import { render } from 'react-dom';

const Stack = createNativeStackNavigator();

export default function App() {
  return(
    <NavigationContainer>
    <Stack.Navigator>
    <Stack.Screen
        name="GameScreen"
        component={GameScreen}
        options={{headerTransparent:true,title:""}}
        moveBack={false}
      />
      {/* <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{headerTransparent:true,title:""}}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{headerTransparent:true,title:""}}
      /> */}
    </Stack.Navigator>
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
    padding:50
  },
  titleText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  titleTextContainer: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionView: {
    flex:6,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  answerView:{
    flex:1,
  }
});
