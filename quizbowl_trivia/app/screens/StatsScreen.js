import React, {Fragment, useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TextInput, Alert,Vibration, Pressable, Dimensions, Modal, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { incrementSentence, incrementWordInSentence, resetGame, setCurrentQuestionText, setRunQuestion,resetWordInSentence,setIsUpdating, incrementPointsByAmount, setCurrentColor, incrementQuestion, setQuestionUserAnswer } from '../../features/game/gameSlice';
import { Icon, Button, ButtonGroup, withTheme} from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const StatsScreen = (props) => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.user.userToken);
    const navigation = useNavigation();
    const [data, setData] = useState(null);
    const categoryList = {
        14: "Mythology",
        15: "Literature",
        16: "Trash",
        17: "Science",
        18: "History",
        19: "Religion",
        20: "Geography",
        21: "Fine Arts",
        22: "Social Science",
        25: "Philosophy",
        26: "Current Events (probably outdated)"
    }
    useEffect(() => {
        const getUserData = async () => {
            await fetch("https://quizbowl.shoryamalani.com/get_user_data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "token": token,
                })
            })
            .then(response => response.json())
            .then(result => {
                console.log(result);
                setData(result);
            }).catch(error => {
                console.log(error);
            }
            )}
        getUserData();
    }, [])
    return (
        <Fragment>
            <LinearGradient
                colors={['#BC4E53', '#4EBCB7']}
                style={{width: width, height: height}}    
            >
            <View style={styles.scoreTextContainer}>
                <Text style={styles.scoreText}>
                    Statistics
                </Text>
            </View>
            <SafeAreaView>
                {data == null && (
                    <Text>Loading...</Text>
                )}
                {data != null && (
                    <>
                    <View style={{height: 50}} />    
                    <ScrollView>
                    {/* <View style={styles.textBox}>    
                    <Text style={styles.statsScreenText}>Login count, XP (breakdown by category), %questions correct, Correct question </Text>
                    </View> */}
                    <View style={styles.textBox}>
                    <Text style={styles.statsScreenText}>Login count: {data[2]}</Text>
                    </View>
                    <View style={styles.textBox}>
                    <Text style={styles.statsScreenText}>XP: {data[8]}</Text>
                    </View>
                    <View style={styles.textBox}>
                    <Text style={styles.statsScreenText}>% questions correct: {(data[11]["questions_correct"]/data[11]["questions_attempted"]).toFixed(4)*100}</Text>
                    </View>
                    <View style={styles.textBox}>
                    <Text style={styles.statsScreenText}>Correct questions: {data[11].questions_correct}</Text>
                    </View>
                    <View style={styles.textBox}>
                    <Text style={styles.statsScreenText}>Attempted questions: {data[11]["questions_attempted"]}</Text>
                    </View>
                    <View style={styles.textBox}>
                    <Text style={styles.statsScreenText}>Average Difficulty: {(data[11]["difficulty_cumulative"]/data[11]['questions_attempted']).toFixed(2)}</Text>
                    </View>
                    <View style={styles.textBox}>
                    <Text style={styles.statsScreenText}>Powers: {data[11]["powers"]}</Text>
                    </View>
                    {Object.keys(data[11]["categories"]).map((key, index) => {
                        return (
                            <View style={styles.textBox} key={key}>
                                <Text style={styles.statsScreenText}>{categoryList[key]}: {data[11]["categories"][key]["questions_correct"]}/{data[11]["categories"][key]["questions_attempted"]}</Text>
                        </View>
                        )
                    })}
                    <View style={{height: 150}} />
                    </ScrollView>
                    </>
                )}
            </SafeAreaView>
            </LinearGradient>
        </Fragment>
    );
}

const styles = StyleSheet.create({
    scoreTextContainer: {
        width: width / 1.2,
        backgroundColor: '#57fde4',
        borderRadius: 30,
        top: 80,
        marginBottom: 10,
        resizeMode: 'contain',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20
    },
    scoreText: {
        fontSize: 35,
        color: '#001310',
        padding: 15,
    },
    statsScreenText: {
        padding: 30,
        fontSize: 18,
        color: '#281e8d'
    },
    textBox: {
        width: width / 1.1,
        backgroundColor: '#03ffa1',
        borderRadius: 30,
        top: 10,
        marginBottom: 10,
        resizeMode: 'contain',
        marginLeft: 15,
        alignItems: 'center',
    },
});

export default StatsScreen;