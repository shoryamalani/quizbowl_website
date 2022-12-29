import React, { Fragment, useEffect } from 'react';
import { StyleSheet, View, Image, Pressable, Dimensions, SafeAreaView, Alert } from 'react-native';
import colors from '../config/colors';
// import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Icon, Button, ButtonGroup, withTheme, Text} from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { setUserToken,setUserID } from '../../features/game/userSlice';
import { sendSignInRequest} from '../backendFunctions';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var questionMarkIconCircle = 200;
var infoIconCircle = 50;
function WelcomeScreen(props) {
    const dispatch = useDispatch();
    const userToken = useSelector(state => state.user.userToken);
    useEffect(() => {
        const createAccount = async ()=> {
            await fetch("https://quizbowl.shoryamalani.com/createAccount", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(response => response.json())
            .then(result => {
                dispatch(setUserToken(result["token"]));
                sendSignInRequest(result["token"]);
            }).catch(error => {
                console.log(error);
            })
        }
        if (userToken == null) {
            createAccount()
        }
    }, []);
    useEffect(() => {
        if (userToken != null) {
            sendSignInRequest(userToken);
        }
    }, []);
    return (
        <Fragment>
            <StatusBar style="dark" />
            {/* <View style={{flex: 1}}> */}
            <LinearGradient
                colors={['#BAC9E8', '#384C9C']}
                style={{ flex: 1 }}    
            >
            <View style={{height: 50}}/>
            <Button type="clear" style={styles.appNameTextContainer} onPress={() => Alert.alert("CONGRATULATIONS", "You found the most obvious easter egg! Now go find the others (some of which are actual eggs)!")}>
            <Text style={styles.appNameText}>Trivia SLAM</Text>        
            </Button>            
            <Button type="clear" buttonStyle={styles.logoWelcomeScreen} onPress={() => Alert.alert("Nice!", "I don't know why you pressed this, but nice job! You found another easter egg :)")}>
                <Image source={require("../assets/questionMarkIcon.png")} style={{ width: questionMarkIconCircle, height: questionMarkIconCircle, borderRadius: questionMarkIconCircle/2 }} />
            </Button>
            <Button type="clear" containerStyle={{justifyContent: 'center', width: 90}} buttonStyle={{ alignSelf: 'flex-start', marginTop: 120, marginLeft: 20, position: 'relative' }} onPress={() => props.navigation.navigate("Stats")}>
                <Image source={require("../assets/statsScreenIconCentered.png")} style={{ width: questionMarkIconCircle/5, height: questionMarkIconCircle/5, borderRadius: questionMarkIconCircle/2 }} />
            </Button>
            <Button type="clear" containerStyle={{top: height/1.5, height: 100, left: width-80, justifyContent: 'flex-end', position: 'absolute', backgroundColor: 'transparent'}} buttonStyle={{ alignSelf: 'flex-end', marginTop: -30, marginRight: width/2 }} onPress={() => props.navigation.navigate("Info")}>
                <Image source={require("../assets/infoIconBigger.png")} style={{ width: questionMarkIconCircle/5, height: questionMarkIconCircle/5, borderRadius: questionMarkIconCircle/2 }} />
            </Button>
            <Button type="clear" containerStyle={{width: 90}} buttonStyle={{borderRadius: 100, alignSelf: 'flex-start', left: 20,right:20, position: 'relative'}} onPress={() => props.navigation.navigate("User")}>
                <Image source={require("../assets/profileIcon.png")} style={{ width: questionMarkIconCircle/5, height: questionMarkIconCircle/5, borderRadius: questionMarkIconCircle/2 }} />
            </Button>  
            <Button type="solid" containerStyle={{
                width: width,
                height: 150,
                borderRadius: 35,
                backgroundColor: '#1D2C9D',
                alignItems: 'center',
                justifyContent: 'center',
                top: height - 150,
                position: 'absolute',
            }}
            buttonStyle={{
                width: width,
                height: 150,
                borderRadius: 35,
                backgroundColor: '#1D2C9D',
            }}     
            onPress={() => { console.log("hi"), props.navigation.push("Game") }}
            title="Start a round!"
            titleStyle={{ color: "white", fontSize: 35 }}
            >
            </Button>
        </LinearGradient>    
            {/* </View> */}
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
        marginTop: 10,
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
        width: width,
        height: 150,
        borderRadius: 35,
        backgroundColor: '#1D2C9D',
        alignItems: 'center',
        justifyContent: 'center',
        top: 50,
    },
    welcomeScreenFullView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'red',
    },
})

export default WelcomeScreen;

{/* <Button type="clear" containerStyle={{
                width: width,
                height: 150,
                borderRadius: 35,
                backgroundColor: '#1D2C9D',
                alignItems: 'center',
                justifyContent: 'center',
                top: height-150,
            }}
            onPress={() => props.navigation.push("Game")}>
                <Text style={{ color: "white", fontSize: 35 }} >Start a round!</Text>
            </Button> */}