import React, { Fragment, useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, Pressable, Dimensions, Switch, Platform, Button, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
// import Picker from '@gregfrench/react-native-wheel-picker';
import { StatusBar } from 'expo-status-bar';
import * as Speech from 'expo-speech';
// import storage from '../components/Storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// var PickerItem = Picker.Item;
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;


const SettingsScreen  =  (props) => {
    const [selectedItem, setSelectedItem] = useState(2);
    const [itemList, setItemList] = useState(['loading...']);
    const [voiceIds, setVoiceIds] = useState(['loading...']);
    Speech.getAvailableVoicesAsync().then((value)=>{
        setItemList(value.map((item) => {
            return item.name
        }));
        setVoiceIds(value.map((item) => {
            return item.identifier
        }))
    });
    const [enabled, setEnabled] = useState(false);
    const toggleSwitch = () => {
        setEnabled(oldValue => !oldValue)
    }
    const saveVoice = () =>{
        // try{
            useEffect(() => {
            //     storage.save({
            //     key: 'whichVoice', // Note: Do not use underscore("_") in key!
            //     data: {
            //         whichVoice: voice
            //     },
              
            //     // if expires not specified, the defaultExpires will be applied instead.
            //     // if set to null, then it will never expire.
            //     expires: null
            //   });
            AsyncStorage.setItem('whichVoice', "just test");
            Alert("data Saved");
            });
        // }catch(e){
        //     alert(e)
        // }
    }
    return (
        <Fragment>
        <LinearGradient
            colors={['#A6FFF9','#E38C58']}  
            style={styles.settingsScreen}>
            <StatusBar style="dark" />
                {/* <ScrollView> */}
                <SafeAreaView>   
                    <View style={styles.pickerContainer}>
                        <Text style={styles.pickerText}>Pick a voice to use:</Text>
                        {itemList &&(
                            <Picker
                                style={{ width: width / 1.2, height: 50 }}
                                selectedValue={selectedItem}
                                itemStyle={{ color: '#4D17E3', fontSize: 26 }}
                                onValueChange={(index) => {
                                    setSelectedItem(index)
                                }}
                            >
                                {itemList.map((value, i) => (<PickerItem label={value} value={i} key={i} />))}
                            </Picker>)}
                        <Pressable onPress={saveVoice}>
                    <Text style={{fontSize: 40, top: 200}}>Select</Text>
                    </Pressable>
                    </View>
                {/* Right now, we don't have this system for switching off the speech yet
                <View style={styles.switchContainer}>
                    <Text>        
                    <Switch
                        onValueChange={toggleSwitch}
                        value={enabled}
                        thumbColor='#4D17E3'
                        trackColor={{true: 'red'}}
                        ios_backgroundColor='blue'
                        style={styles.switch}        
                    />
                    {enabled ? "The phone will speak": "The phone won't speak"}
                    </Text>
                </View> */}
                </SafeAreaView>
                {/* </ScrollView> */}
        </LinearGradient>
        </Fragment>
    );
}
const styles = StyleSheet.create({
    pickerContainer: {
        alignItems: 'center',
        width: width / 1.2,
        height: height / 3,
        backgroundColor: '#DEFFA6',
        borderRadius: 30,
        marginVertical: 40,
    },
    pickerText: {
        fontSize: 25,
        top: 10,
        color: '#2A23F7',
        fontWeight: 'bold',
    },
    settingsScreen: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    switch: {
        
    },
    switchContainer: {
        width: width / 1.2,
        height: 60,
        backgroundColor: '#DEFFA6',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '15'
    },
})
export default SettingsScreen;