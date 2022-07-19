import React, { Component, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TextInput, Button,Alert } from 'react-native';
import StartGameOverview from '../components/startGameOverview';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import ReactTimeout from 'react-timeout'



class GameScreen extends React.Component {
   constructor(){
    const [answerText, setAnswerText] = useState('');
    const [questionText, setQuestionText] = useState('This is an example question');
    const [currentQuestions, setCurrentQuestions] = useState([]);
    const [modalIsVisible, setModalIsVisible] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [runQuestion, setRunQuestion] = useState(false);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [currentWordsInQuestion, setCurrentWordsInQuestion] = useState(0);
    const [timerState, setTimerState] = useState(null);
    const [gameTicks, setGameTicks] = useState(0);
   }
    
    
changeAnswerText(text){
    setAnswerText(text);
    console.log(text);
  };
  

  submitAnswer(){
    console.log(answerText);
    if(answerText.toLowerCase() === currentQuestions[currentQuestion].answer.toLowerCase()){
      Alert.alert("Correct!", "You are correct!");
      setCurrentQuestion(currentQuestion + 1);
    };
    setAnswerText('');
    if (currentQuestion === currentQuestions.length){
      setModalIsVisible(true);
    }else{
      setCurrentQuestion(currentQuestion + 1);

      setQuestionText("");
      console.log(currentQuestions[currentQuestion].answer);

    }

  }
  tick(){
    console.log(runQuestion);
    console.log(currentQuestion);
    console.log(questionText);
    if(runQuestion && currentWordsInQuestion < questionText.length){
        setQuestionText(questionText => questionText + " " + currentQuestions[currentQuestion].question[currentWordsInQuestion]);
        console.log(currentQuestions[currentQuestion].question[currentWordsInQuestion]);
        setCurrentWordsInQuestion(currentWordsInQuestion + 1);
        console.log(currentWordsInQuestion);
    }
  };
  startGame(questions){
    setCurrentQuestions(questions);
    setCurrentQuestion(0);
    console.log(questions[0].question.join(" "));
    console.log(questions[0].answer);

    setModalIsVisible(false);
    setRunQuestion(true);
    let timer = setInterval(tick, 10000);
    setTimerState(timer);
  }
  
  return (){
    <View style={styles.container}>
      <View style={styles.titleTextContainer}>
      <Text style={styles.titleText}>Trivia</Text>
      <StartGameOverview visible={modalIsVisible} startGame={startGame}/>
      </View>
      <View style={styles.questionView}>
        <Text>
          {questionText}
        </Text>
      </View>
      <View style={styles.answerView}>
      <TextInput onChangeText={changeAnswerText} value={answerText} placeholder='answer' />
      <Button title='Submit' onPress={submitAnswer} />
      </View>
      <StatusBar style="auto" />
    </View>
  };

}

export default GameScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'orange',
      alignItems: 'center',
      justifyContent: 'center',
      padding:50
    },
    titleText: {
      fontSize: 30,
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      margin: 10,
    },
    titleTextContainer: {
      flex:1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    questionView: {
      flex:6,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 10,
    },
    answerView:{
      flex:1,
    }
  });
  