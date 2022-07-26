import React, { Fragment } from 'react';
import { StyleSheet, View, Image, Text, Pressable, Dimensions } from 'react-native';
import colors from '../config/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var questionMarkIconCircle = 200;
function WelcomeScreen(props) {
    return (
        <Fragment>
            <StatusBar style="dark" />
            <View style={styles.welcomeScreenFullView}>
            <LinearGradient
                    colors={['#BAC9E8', '#384C9C']}
                    style={{ flex: 1 }}    
            >
                {/* <View style={styles.settingsButton}>
            <Pressable onPressIn={() => props.navigation.navigate("Settings")} hitSlop={0} >
                <Image source={require("../assets/settingsIconDarkBlue.png")}/>
            </Pressable> */}
                {/* </View> */}
            <Pressable style={{position: 'absolute', bottom: 80,}} onPress={() => props.navigation.push("Game")}>
                <View style={{width: width, alignItems: 'center'}}>            
                    <View style={styles.startRoundButton}><Text style={{ color: "white", fontSize: 35 }} >Start a round!</Text></View>
                </View>
            </Pressable>
            <Pressable onPress={() => { console.log('hi');props.navigation.navigate("Info") }} style={{alignItems: 'center', right: 30}}>
                <View style={{padding: 30, margin: 5}} >
                    <Image source={require('../assets/infoIconDarkBlueWhite.png')} style={styles.moreInfoButton} />
                </View>
            </Pressable>
            <View style={styles.appNameTextContainer}>
            <Text style={styles.appNameText}>Trivia Speaks</Text>        
            </View>        
            <View style={styles.logoWelcomeScreen}>
                <Image source={require("../assets/questionMarkIcon.png")} style={{ width: questionMarkIconCircle, height: questionMarkIconCircle, borderRadius: questionMarkIconCircle/2 }} />
            </View>
        </LinearGradient>    
            </View>
        </Fragment>
    );
}

const styles = StyleSheet.create({
    appNameText: {
        fontSize: 40,
        textAlign: 'center',
        padding: 20,
        color: 'white'
    },
    appNameTextContainer: {
        width: width / 1.2,
        alignSelf: 'center',
        resizeMode: 'contain',
        backgroundColor: '#281e8d',
        borderRadius: 15,
        marginBottom: 30,
        marginTop: 80
    },
    logoWelcomeScreen: {
        alignSelf: 'center',
        position: 'relative',
    },
    moreInfoButton: {
        width: 40,
        height: 40,
        position: 'absolute',
        left: width / 2,
        bottom: height / 5 - 200,
        padding: 10,
    },
    settingsButton: {
        marginTop: 25,
        marginLeft: 25,
        paddingTop: 30,
    },
    startRoundButton: {
        flex: 1,
        width: width,
        height: 150,
        borderRadius: 40,
        backgroundColor: '#1D2C9D',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: -80,
    },
    welcomeScreenFullView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'red',
    },
})

export default WelcomeScreen;