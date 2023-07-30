import React, {Fragment, useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TextInput, Alert,Image, Switch, Dimensions, Modal, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { incrementSentence, incrementWordInSentence, resetGame, setCurrentQuestionText, setRunQuestion,resetWordInSentence,setIsUpdating, incrementPointsByAmount, setCurrentColor, incrementQuestion, setQuestionUserAnswer, toggleTopic, setSpeechSpeed } from '../../features/game/gameSlice';
import { Button} from 'react-native-paper';
import * as rnThemed from '@rneui/themed' ;
import { useNavigation } from '@react-navigation/native';
import constants from '../config/constants';
import GameDifficultyInfo from './gameDifficultyInfo';
import SpeechSpeed from './speechSpeed';
import { io } from 'socket.io-client';
import Slider from '@react-native-community/slider';

// import io from 'socket.io-client';
const u_io = io(constants.apiUrl, { transports: ['websocket'] });
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const LiveMultiplayer = (props) => {
    // const io = new SocketIOClient(constants.apiUrl);
    // io.connect();
    
    const navigation = useNavigation();
    const [rooms, setRooms] = useState([]);
    const [sliderValue, setSliderValue] = useState(0);
    const [showAllRooms, setShowAllRooms] = useState(true);
    const [singleRoom, setSingleRoom] = useState(null);
    const [roomUsers, setRoomUsers] = useState(null);
    const speechSpeed = useSelector(state => state.game.speechSpeed);
    const difficultyCategories = {
        1: 'Middle School',
    2: 'Easy High School',
    3: 'Regular HS',
    4: 'Hard High School',
    5: 'Nationals HS',
    6: 'Easy College',
    7: 'Regular College',
    8: 'Hard College',
    9: 'Open',
    10: 'Random!',


    }
    const userToken = useSelector(state => state.user.userToken);
    const topics = useSelector(state => state.game.topics);
    useEffect(() => {
        u_io.emit('getRooms')    
    }, []);

    useEffect(() => {
    
    console.log("Emmited get rooms " + userToken);
    u_io.on('roomsResponse', (rooms) => {
        console.log("Rooms")
        console.log(rooms);
        setRooms(null);
        setRooms(rooms);
    })
    u_io.on('roomCreated', (room) => {
        console.log("Room created");
        console.log(room);
        // navigation.navigate('MultiplayerGame', {room: room});
    });
    u_io.on('roomJoined', (room) => {
        console.log("Room joined");
        console.log(room['room_info']);
        setSingleRoom(room['room_info']);
        setRoomUsers(room['room_users']);
        setShowAllRooms(false);
    })
    
    }, []);
    const createRoom = () => {
        console.log("Create room");
        u_io.emit('createRoom', {
            "token": userToken,
            topics: topics
        });
        // u_io.on('roomsResponse', (rooms) => {
        //     console.log("Rooms")
        //     console.log(rooms);
        //     setRooms(null);
        //     setRooms(rooms);
        // })
    }
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
            {showAllRooms == true && 
            <>
            <View style={styles.textBox}>    
                        <rnThemed.Button type='clear' onPress={()=>{
                                createRoom();
                        }}>
                            <Text style={styles.statsScreenText}>Create Room
                            </Text>
                            </rnThemed.Button>
                        </View>
            <View style={styles.scoreTextContainer}>
                <Text style={styles.scoreText}>
                    Open Rooms {rooms != null && rooms.length}
                </Text>
            </View>
            </>
            }
            {singleRoom != null && userToken == singleRoom['room_owner'] && (
                    <>
                    <ScrollView directionalLockEnabled={true} style={{marginTop: 30, alignSelf: 'center'}}>
                    <View style={{alignItems: 'center', paddingBottom: 40, top:-60}}>
                    <Text style={styles.sliderCategoryHeader}>Game Difficulty</Text>
                    <Slider
                    maximumValue={10}
                    minimumValue={1}
                    step={1}
                    value={sliderValue}
                    onValueChange={(sliderValue) => setSliderValue(sliderValue)}
                    style={styles.sliderDifficulty}
                    minimumTrackTintColor='#0D7EFF'
                    maximumTrackTintColor='#A6FFF9'
                    thumbTintColor='#4EBCB7'/>
                    <View style={styles.difficultyCategoryContainer}>
                    <Text style={styles.sliderCategoryText}>Level {sliderValue}: {difficultyCategories[sliderValue]}
                    {/* <Pressable onPress={() => {props.switchToInfoAboutDifficult()}} >
                        <Image source={require('../assets/questionMarkCircleBlue.png')} style={styles.questionMarkInCircle} />
                    </Pressable> */}
                    </Text>
                    </View>
                    </View>
                    <View style={{alignItems: 'center', paddingBottom: 20, top: -100}}>
                    <Text style={styles.sliderCategoryHeader}>Speaking Rate/WPM</Text>
                    <Slider
                    maximumValue={12}
                    minimumValue={1}
                    step={1}
                    value={speechSpeed}
                    onValueChange={(newSpeechVal) => {dispatch(setSpeechSpeed(newSpeechVal))
                        console.log(newSpeechVal)
                    }}
                    style={styles.speechSpeed}
                    minimumTrackTintColor='#0D7EFF'
                    maximumTrackTintColor='#A6FFF9'
                    thumbTintColor='#4EBCB7' />
                    <Text style={styles.sliderCategoryText}>Speaking rate is {speechSpeed}
                    {/* <Pressable onPress={() => {props.switchToInfoAboutDifficult()}} >
                        <Image source={require('../assets/questionMarkCircleBlue.png')} style={styles.questionMarkInCircle} />
                    </Pressable> */}
                    </Text>
                    </View>
                    <View style={styles.textBox}>
                        <rnThemed.Button type='clear' onPress={
                            () => {
                                console.log("Start game");
                                u_io.emit('startGame', {
                                    token: userToken,
                                    roomId: singleRoom[0]
                                });
                            }}>
                    <Text styles={styles.statsScreenText}>Start Game</Text>
                    </rnThemed.Button>
                    </View>
                    </ScrollView>
                    {/* <GameDifficultyInfo/>
                    <SpeechSpeed/> */}
                    
                    </>
                )

            }
            <ScrollView>
            {rooms != null && showAllRooms && rooms.map((room) => {
                return (
                    <View style={styles.textBox} key={room[0]}>    
                    <rnThemed.Button type='clear' onPress={
                        () => {
                            u_io.emit('joinRoomById', {
                                token: userToken,
                                roomId: room[0]
                            });
                            
                        }
                    }>
                        <Text style={styles.statsScreenText}>{room[1]} </Text>
                    </rnThemed.Button>
                    </View>
                    )
                })
            }
            {singleRoom != null && !showAllRooms &&
            roomUsers.map((user) => {
                return (
                    <View style={styles.textBox}>
                        <rnThemed.Button type='clear' onPress={
                            () => {
                                console.log("User clicked");
                            }}>
                    <Text styles={styles.statsScreenText}>{user[1]}</Text>
                    </rnThemed.Button>
                </View>
                    )
                })
            }
            
            {/* {
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
                    } */}
                {/* })
            } */}
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
    difficultyCategoryContainer: {
        alignItems: 'center',
      },
      inputContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: height,
        flexDirection: 'column',
      },
      pickerContainer: {
        alignItems: 'center',
        width: width / 1.2,
        height: height / 3,
        backgroundColor: '#DEFFA6',
        borderRadius: 30,
        marginBottom: 20,
      },
      questionMarkInCircle: {
        width: 17,
        height: 17,
        top: -8,
        marginRight: 5,
        marginLeft: 5
      },
      sliderCategoryHeader: {
        fontSize: 27,
        marginLeft: 10,
        marginRight: 10,
        color: '#1D2C9D',
        paddingTop: 80,
      },
      sliderCategoryText: {
        fontSize: 20,
        marginLeft: 10,
        marginRight: 10,
        color: '#1D2C9D',
        paddingBottom: 0,
      },
      sliderDifficulty: {
        width: width / 1.2,
        height: 40,
      },
      speechSpeed: {
        width: width / 1.2,
        height: 40
      },
      startGameButton: {
        width: width/1.5,
        height: height/7,
        backgroundColor: '#162692',
        alignItems: 'center',
        borderRadius: 20,
        justifyContent: 'center',
      },
      startGameText: {
        fontSize: 30,
        padding: 10,
        color: '#D6FFCF',
      },
      xMark: {
        width: 30,
        height: 30,
        position: 'absolute',
        left: width / 2 - 20,
        bottom: height / 5 - 25,
        padding: 10
      },
});

export default LiveMultiplayer;