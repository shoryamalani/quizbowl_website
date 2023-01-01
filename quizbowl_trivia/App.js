import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TextInput, Button,Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from './app/screens/WelcomeScreen';
import SettingsScreen from './app/screens/SettingsScreen';
import EndOfRoundScreen from './app/screens/EndOfRoundScreen';
import GameScreen from './app/screens/GameScreen';
import InfoScreen from './app/screens/InfoScreen';
import StatsScreen from './app/screens/StatsScreen';
import CategoriesScreen from './app/screens/CategoriesScreen';
import UserScreen from './app/screens/UserScreen';
import { render } from 'react-dom';
import 'expo-dev-client';
// redux imports
import store, {persistedReducer} from './utils/store'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
const Stack = createNativeStackNavigator();
let persistor = persistStore(store);

export default function App() {
  return(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
    <NavigationContainer>
    <Stack.Navigator initialRouteName='Welcome'>
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerTransparent: true, gestureEnabled: false, headerBackVisible: false, title: "" }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{headerTransparent:true, gestureEnabled: true, headerBackVisible: true, title:""}}
      />
      <Stack.Screen
        name="User"
        component={UserScreen}
        options={{headerTransparent:true, gestureEnabled: true, headerBackVisible: true, title:""}}
      />    
      <Stack.Screen
        name="Info"
        component={InfoScreen}
        options={{headerTransparent:true, gestureEnabled: true, headerBackVisible: true, title:""}}
      />
      <Stack.Screen
        name="Stats"      
        component={StatsScreen}
        options={{headerTransparent:true, gestureEnabled: true, headerBackVisible: true, title: ""}}      
      />
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{headerTransparent:true, gestureEnabled: false, headerBackVisible: false, title: ""}}  
      />      
      <Stack.Screen
        name="Game"
        component={GameScreen}
        options={{headerTransparent:true, gestureEnabled: false, headerBackVisible:false, title:""}}
        moveBack={false}
      />
      <Stack.Screen
        name="End Of Round"
        component={EndOfRoundScreen}
        options={{headerTransparent:true, gestureEnabled: false, headerBackVisible:false, title:""}}
        moveBack={false}
      />
    </Stack.Navigator>
  </NavigationContainer>
  </PersistGate>
  </Provider>
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
