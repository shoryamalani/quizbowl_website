import React, { Component, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TextInput, Button,Alert } from 'react-native';
import StartGameOverview from '../components/startGameOverview';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import ReactTimeout from 'react-timeout'
import * as Speech from 'expo-speech';


class GameScreen extends Component {
    state = {
        answerText: '',
        questionText: 'This is an example question',
        currentQuestions: [],
        gameSettingsModalIsVisible: true,
        currentQuestion: 0,
        runQuestion: false,
        score: 0,
        round: 1,
        currentWordsInQuestion: 0,
        timerState: null,
        gameTicks: 0,
        gameDiffultyInfoModalIsVisible: false,
        useSpeech: true,
    }
   constructor(){
    super()
    this.changeAnswerText = this.changeAnswerText.bind(this)
    this.submitAnswer = this.submitAnswer.bind(this)
    this.startGame = this.startGame.bind(this)
    this.tick = this.tick.bind(this)
    this.switchToInfoAboutDifficult = this.switchToInfoAboutDifficult.bind(this)
    this.useSpeechQuestionStarter = this.useSpeechQuestionStarter.bind(this)
   }
    
    
changeAnswerText(text){
    this.state.answerText = text;
    console.log(text);
  };
  
  switchToInfoAboutDifficult(){
    this.state.gameSettingsModalIsVisible = !this.state.gameSettingsModalIsVisible;
    this.state.gameDiffultyInfoModalIsVisible = !this.state.gameDiffultyInfoModalIsVisible;
  }
  submitAnswer(){
    console.log(this.state.answerText);
    if(this.state.answerText.toLowerCase() === this.state.currentQuestions[this.state.currentQuestion].answer.toLowerCase()){
      Alert.alert("Correct!", "You are correct!");
      this.setState({
        currentQuestion: this.state.currentQuestion + 1,
      })
    };
    this.state.answerText = '';
    if (this.state.currentQuestion === this.state.currentQuestions.length){
      this.state.gameSettingsModalIsVisible = true
    }else{
      this.state.currentQuestion = this.state.currentQuestion + 1;

      this.state.questionText = "";
      console.log(this.state.currentQuestions[this.state.currentQuestion].answer);

    }

  }
  tick(){
    console.log(this.state.runQuestion);
    console.log(this.state.currentQuestion);
    console.log(this.state.questionText);
    // console.log(this.state.currentQuestions);
    if(this.state.runQuestion && this.state.currentWordsInQuestion < this.state.currentQuestions[this.state.currentQuestion].question.length){
        this.setState({questionText:this.state.questionText + " " + this.state.currentQuestions[this.state.currentQuestion].question[this.state.currentWordsInQuestion]});
        console.log(this.state.currentQuestions[this.state.currentQuestion].question[this.state.currentWordsInQuestion]);
        this.state.currentWordsInQuestion = this.state.currentWordsInQuestion + 1;
        console.log(this.state.currentWordsInQuestion);
    }
  };
  useSpeechQuestionStarter(){
    Speech.speak(this.state.currentQuestions[this.state.currentQuestion].question.join(" "),{
      language: 'en-US',
      pitch: 1,
      rate: 1,
      onDone: () => {
        this.state.runQuestion = true;
        let timer = setInterval(this.tick, 500);
        this.state.timerState = timer;
      },
      onBoundary: (event) => {
        console.log(event);
      }
    });
  }
  startGame(questions){
    this.setState({currentQuestions: questions});
    console.log(this.state.currentQuestions);
    this.state.currentQuestion=0;
    this.state.questionText = "";
    console.log(questions[0].question.join(" "));
    console.log(questions[0].answer);

    this.setState({
      gameSettingsModalIsVisible: false,
    });
    if(!this.state.useSpeech){
      this.state.runQuestion = true;
      let timer = setInterval(this.tick, 500);
      this.state.timerState = timer;
    }else{
      this.useSpeechQuestionStarter();
    }
    // this.tick()
  }
  render (){
    return (
    <View style={styles.container}>
      <View style={styles.titleTextContainer}>
      <Text style={styles.titleText}>Trivia</Text>
      <StartGameOverview visible={this.state.gameSettingsModalIsVisible} startGame={this.startGame}/>
      </View>
      <View style={styles.questionView}>
        <Text>
          {this.state.questionText}
        </Text>
      </View>
      <View style={styles.answerView}>
      <TextInput onChangeText={this.changeAnswerText} value={this.answerText} placeholder='answer' />
      <Button title='Submit' onPress={this.submitAnswer} />
      </View>
      <StatusBar style="auto" />
    </View>
    );
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
  