import React, {Fragment, useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TextInput, Alert,Image, Switch, Dimensions, Modal, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { incrementSentence, incrementWordInSentence, resetGame, setCurrentQuestionText, setRunQuestion,resetWordInSentence,setIsUpdating, incrementPointsByAmount, setCurrentColor, incrementQuestion, setQuestionUserAnswer, toggleTopic } from '../../features/game/gameSlice';
import { Button} from 'react-native-paper';
import * as rnThemed from '@rneui/themed' ;
import { useNavigation } from '@react-navigation/native';
import constants from '../config/constants';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const LiveMultiplayer = (props) => {
    const navigation = useNavigation();
    const [users, setUsers] = useState([]);
    const [showAllUsers, setShowAllUsers] = useState(true);
    const [singleUser, setSingleUser] = useState(null);
    const topics = useSelector(state => state.game.topics);
    useEffect(() => {
        const getAllUsers = async () => {
            await fetch(constants.apiUrl+'/get_all_users')
            .then(response => response.json())
            .then(result => {
                console.log(result);
                setUsers(result);
            }).catch(error => {
                console.log(error);
            })
        }
        getAllUsers();
    },[])

    // const onToggleSwitch = (id) => dispatch(toggleTopic(String(id)));
    // const categoryList = {
    //     14: "Mythology",
    //     15: "Literature",
    //     16: "Trash",
    //     17: "Science",
    //     18: "History",
    //     19: "Religion",
    //     20: "Geography",
    //     21: "Fine Arts",
    //     22: "Social Science",
    //     25: "Philosophy",
    //     26: "Current Events (probably outdated)"
    // }
    // categoryList = () => {
        
    // }

// BASIC TEMPLATE FOR EACH NEW CATEGORY BOX:
    // <View style={styles.textBox}>    
    //     <Text style={styles.statsScreenText}>Literature</Text>
    //         <Switch
    //             style={{ height: 30, bottom: 27, alignSelf: 'flex-end', right: 20 }}
    //             thumbColor="#ff3bac"
    //             value={isSwitchOn}
    //             onValueChange={onToggleSwitch}
    //             trackColor={{ false: '#3b92ff', true: '#51009c' }}
    //             ios_backgroundColor='#3b92ff'
    //     />
    // </View>

    const getSum = (arr) => {
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        return sum;
    }

    return (
        <Fragment>
            <LinearGradient
                colors={['#D6FFCF', '#7DFF83']}
                style={{width: width, height: height}}    
            >
            <SafeAreaView>
            <View style={{height: 30}} />    
            <Button
                style={{alignSelf: 'flex-end', width: 30, height: 50, borderRadius: 100}}
                contentStyle={{alignSelf: 'center'}}
                buttonColor="transparent"
                icon={() => (
                    <Image
                        source={require('../assets/xMarkGreen.png')}
                        style={styles.xMark}
                    />
                )}
                onPress={() => {
                console.log('hi');
                props.switchToSettings();
            }} >
            </Button>
            <View style={styles.scoreTextContainer}>
                <Text style={styles.scoreText}>
                    Public Users
                </Text>
            </View>
            <ScrollView>
            {users != null && showAllUsers && users.map((user) => {
                return (
                    <View style={styles.textBox} key={user[4]}>    
                    <rnThemed.Button type='clear' onPress={
                        () => {
                            console.log(user[11].rounds)
                            setSingleUser(user);
                            setShowAllUsers(false);
                        }
                    }>
                        <Text style={styles.statsScreenText}>{user[1]}{'\n'}Games: {user[11].rounds.length} </Text>
                    </rnThemed.Button>
                    </View>
                    )
                })
            }
            {
                !showAllUsers && singleUser != null && 
                singleUser[11].rounds.map((round) => {
                    console.log(round)
                    if (round.questions.length>0){
                    return (
                        <View style={styles.textBox} key={round['time']}>    
                        <rnThemed.Button type='clear' onPress={
                            () => {
                                const makeGameFromRound = (round) => {
                                    fetch(constants.apiUrl+'/get_game_from_round', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            time: round['time'],
                                            user: singleUser[4]
                                        })
                                    }).then(response => response.json())
                                    .then(result => {
                                        result = result.questions;
                                        console.log(result);
                                        for(var i = 0; i < result.length; i++) {
                                            result[i].question = result[i].question.split(" ");
                                        }
                                        props.startGame(result,round.points);
                                    }).catch(error => {
                                        console.log(error);
                                    }
                                    )

                                }
                                makeGameFromRound(round);
                            }
                        }>
                            <Text style={styles.statsScreenText}>Round Length: {round.questions.length}
                            </Text>
                            <Text style={styles.statsScreenText}>
                            Points: {getSum(round.points)}
                            </Text>
                            </rnThemed.Button>
                        </View>
                    )}
                    else{
                        return null;
                    }
                })
            }
            {/* <View style={styles.textBox}>    
            <Text style={styles.statsScreenText}>Literature</Text>
                <Switch
                    style={{ height: 30, bottom: 27, alignSelf: 'flex-end', right: 20 }}
                    thumbColor="#ff3bac"
                    value={isSwitchOn}
                    onValueChange={onToggleSwitch}
                    trackColor={{ false: '#3b92ff', true: '#51009c' }}
                    ios_backgroundColor='#3b92ff'
                />
            </View> */}
            {/* <View style={styles.textBox}>     */}
            {/* <Text style={styles.statsScreenText}>Literature</Text>
                <Switch
                    style={{ height: 30, bottom: 27, alignSelf: 'flex-end', right: 20 }}
                    thumbColor="#ff3bac"
                    value={isSwitchOn}
                    onValueChange={onToggleSwitch}
                    trackColor={{ false: '#3b92ff', true: '#51009c' }}
                    ios_backgroundColor='#3b92ff'
                />
            </View>             */}
            <View style={{height: 200}} />
            </ScrollView>
            </SafeAreaView>
            </LinearGradient>
        </Fragment>
    );
}

const styles = StyleSheet.create({
    scoreTextContainer: {
        width: width / 1.2,
        backgroundColor: '#ff6100',
        borderRadius: 30,
        top: -10,
        marginBottom: 10,
        resizeMode: 'contain',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20
    },
    scoreText: {
        fontSize: 35,
        color: '#000877',
        padding: 15,
    },
    statsScreenText: {
        padding: 30,
        paddingBottom: 0,
        fontSize: 18,
        color: '#120054',
        top: -13
    },
    textBox: {
        width: width / 1.1,
        backgroundColor: '#ffa900',
        borderRadius: 30,
        top: 0,
        marginBottom: 20,
        resizeMode: 'contain',
        marginLeft: 15,
        alignItems: 'flex-start',
    },
    xMark: {
        width: 30,
        height: 30,
        position: 'absolute',
        top: -15,
        left: -15,
    },
});

export default LiveMultiplayer;