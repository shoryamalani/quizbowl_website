import React, { Fragment, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, Dimensions, View, ScrollView, Image, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';
import { Button } from '@rneui/themed';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

function LastQuestionInfo(props) {
    const currentQuestion = useSelector(state => state.game.currentQuestion);
    const gameQuestions = useSelector(state => state.game.gameQuestions);
    const [questionData, setQuestionData] = useState(null);
    useEffect(() => {
      const getQuestionData = async () => {
        await fetch("https://quizbowl.shoryamalani.com/get_answer_data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
            body: JSON.stringify({
                "answer": gameQuestions[currentQuestion-1].answer,
            })
        })
        .then(response => response.json())
        .then(result => {
        console.log(result);
          setQuestionData(result);
        }).catch(error => {
          console.log(error);
        })
      }
        getQuestionData();
    
      
    }, [])
    
    return (
        <Fragment>
        { questionData == null && (
            <Button type="clear" loading buttonStyle={{backgroundColor: 'transparent'}}>
                Loading...
            </Button>
        )}
        { questionData != null && (
        <View style={styles.infoScreenTextContainer}>
            <StatusBar style="dark"/>
            <LinearGradient
                colors={['#E38C58', '#4EBCB7']}
                style={{width: width, height: height}}    
            >
            <Button buttonStyle={{backgroundColor: '#03ffa9'}} containerStyle={{width: 150, borderRadius: 15, top: 30, left: 10, backgroundColor: '#03ffa9'}}>
                <Text>
                    Save Answerline
                </Text>
            </Button>           
            <Button onPress={() => { console.log('henlo')}} type = "clear" containerStyle={{left: width-50, alignItems: 'flex-start', width: 50, height: 40, top: -12, backgroundColor: 'transparent'}}>
                <Image source={require('../assets/xMarkGreen.png')} style={styles.xMark} />       
            </Button>
            {/* <View style={{flex: 1}} > */}
                        
            <View style={[styles.scoreTextContainer, {top: 10}]}>
                <Text style={styles.scoreText}>
                    Clues about (last answerline)
                </Text>
            </View>                
            <ScrollView style={{top: 20}}>         
            {questionData.map((question, index) => {
            return (
            <View style={styles.textBox} key={index}>
                <Text style={styles.infoScreenText}>{question[0]} difficulty: {question[1]}</Text>
            </View>
                )
            })}
            <View style={{height: 150}} />
            </ScrollView>
            {/* </View> */}
            </LinearGradient>
        </View>
        )}
        </Fragment>
    );
}

const styles = StyleSheet.create({
    infoScreenText: {
        padding: 30,
        fontSize: 18,
        color: '#281e8d'
    },
    infoScreenNote: {
        padding: 30,
        fontSize: 19,
        color: 'black'
    },
    infoScreenTextContainer: {
        flex: 1,
    },
    scoreTextContainer: {
        width: width / 1.2,
        backgroundColor: '#fe76e9',
        borderRadius: 30,
        top: 60,
        marginBottom: 10,
        resizeMode: 'contain',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20
    },
    scoreText: {
        fontSize: 30,
        color: '#001310',
        padding: 15,
    },
    textBox: {
        width: width / 1.1,
        backgroundColor: '#03ffa9',
        borderRadius: 30,
        top: 10,
        marginBottom: 10,
        resizeMode: 'contain',
        marginLeft: 15,
        // alignItems: 'center',
    },
    xMark: {
        width: 30,
        height: 30,
    },
})

export default LastQuestionInfo;