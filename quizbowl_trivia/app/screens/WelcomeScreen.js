import React, { Fragment } from 'react';
import { StyleSheet, View, Image, Text, Pressable, Dimensions } from 'react-native';
import colors from '../config/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var questionMarkIconCircle = 200;
function WelcomeScreen(props) {
    return (
        <Fragment>
            <View style={styles.welcomeScreenFullView}>
            <LinearGradient
                colors={['#BAC9E8', '#384C9C']}
                style={{width: width, height: height}}    
            >
                <View style={styles.settingsButton}>
            <Pressable onPress={() => props.navigation.navigate("Settings")}>
                <Image source={require("../assets/settingsIconDarkBlue.png")} style={{padding: 25, width: 40, height: 40}} />
            </Pressable>
                </View>
                <View style={styles.moreInfoButton}>
            <Pressable onPress={() => props.navigation.navigate("Info")}>    
                    <Image source={require('../assets/infoIconDarkBlueWhite.png')} />
            </Pressable>
                </View>
            <Pressable style={{position: 'absolute', bottom: 80}} onPress={() => props.navigation.navigate("Game")}>
                    <View style={styles.startRoundButton}><Text style={{color: "white", fontSize: 35}} >Start a round!</Text></View>
            </Pressable>
            <View style={styles.logoWelcomeScreen}>
                <Image source={require("../assets/questionMarkIcon.png")} style={{ width: questionMarkIconCircle, height: questionMarkIconCircle, borderRadius: questionMarkIconCircle/2 }} />
            </View>    
        </LinearGradient>    
            </View>
        </Fragment>
    );
}

const styles = StyleSheet.create({
    logoWelcomeScreen: {
        alignSelf: 'center',
        position: 'relative',
    },
    moreInfoButton: {
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 30,
        padding: 20,
        paddingTop: 0,
        top: -20,
    },
    settingsButton: {
        top: 25,
        left: 25,
        paddingTop: 50,
    },
    startRoundButton: {
        flex: 1,
        width: width,
        height: 150,
        borderRadius: 40,
        backgroundColor: '#1D2C9D',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: -80
    },
    welcomeScreenFullView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'red',
    },
})

export default WelcomeScreen;