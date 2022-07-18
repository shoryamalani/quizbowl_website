import React, { Fragment } from 'react';
import { ImageBackground, StyleSheet, View, Image, Text, Pressable, Dimensions } from 'react-native';
import colors from '../config/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

function WelcomeScreen(props) {
    return (
        <Fragment>
        <SafeAreaView style={styles.welcomeScreenFullView}>        
                <View style={styles.settingsButton}>
            <Pressable onPress={() => props.navigation.navigate("Settings")}>
                <Image source={require("../assets/settingsIconBlack.png")} style={{padding: 25}} />
            </Pressable>
                </View>
                <View style={styles.moreInfoButton}>
            <Pressable onPress={() => props.navigation.navigate("Info")}>    
                    <Image source={require('../assets/infoIconBlack.png')} />
            </Pressable>
                </View>
            <Pressable style={{position: 'absolute', bottom: 80}} onPress={() => props.navigation.navigate("Game")}>
                    <View style={styles.startRoundButton}><Text style={{color: "yellow"}}>Start a round!</Text></View>
            </Pressable>
            <View style={styles.logoWelcomeScreen}>
                    <Image source={require("../assets/glubface.jpg")} style={{ width: width / 2, height: height/3}} />
            </View>    
        </SafeAreaView>
        </Fragment>
    );
}

const styles = StyleSheet.create({
    logoWelcomeScreen: {
        width: width/2,
        height: height/4,
        backgroundColor: 'red',
        alignSelf: 'center',
        position: 'relative',
    },
    moreInfoButton: {
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 30,
        padding: 20,
        top: -40,
    },
    settingsButton: {
        top: 25,
        left: 25,
    },
    startRoundButton: {
        flex: 1,
        width: width,
        height: 50,
        backgroundColor: colors.startRoundButtonColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    welcomeScreenFullView: {
        flex: 1,
        flexDirection: 'column',
    },
})

export default WelcomeScreen;