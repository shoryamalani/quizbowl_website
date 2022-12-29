import React, { Fragment, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, Dimensions, View, ScrollView, Pressable, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';

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
            <Text>Loading...</Text>
        )}
        { questionData != null && (
        <View style={styles.infoScreenTextContainer}>
            <StatusBar style="dark"/>
            <LinearGradient
                colors={['#E38C58', '#4EBCB7']}
                style={{width: width, height: height}}    
            >
            <SafeAreaView>
            <ScrollView>         
            {questionData.map((question, index) => {
            return (
            <View style={styles.textBox} key={index}>
                <Text style={styles.infoScreenText}>{question[0]} difficulty: {question[1]}</Text>
            </View>
            )})}
            </ScrollView>
            </SafeAreaView>
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
})

export default LastQuestionInfo;