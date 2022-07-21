import React, { Fragment, useState } from 'react';
import { StyleSheet, View, Image, Text, Pressable, Dimensions, Switch, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import Picker from '@gregfrench/react-native-wheel-picker';
import { StatusBar } from 'expo-status-bar';
import * as Speech from 'expo-speech';

var PickerItem = Picker.Item;
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;


function SettingsScreen(props) {
    const [selectedItem, setSelectedItem] = useState(2);
    const [itemList, setItemList] = useState(['loading...']);
    Speech.getAvailableVoicesAsync().then((value)=>{
        setItemList(value.map((item) => {
            return item.name
        }))
    });
    const [enabled, setEnabled] = useState(false);
    const toggleSwitch = () => {
        setEnabled(oldValue => !oldValue)
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
                                onValueChange={(index) => setSelectedItem(index)}
                            >
                                {itemList.map((value, i) => (<PickerItem label={value} value={i} key={i} />))}
                            </Picker>)}
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