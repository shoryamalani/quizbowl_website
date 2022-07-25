import React, { Component, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TextInput, Button,Alert,Vibration, Pressable, Dimensions } from 'react-native';
import StartGameOverview from '../components/startGameOverview';
import GameDifficultyInfo from '../components/gameDifficultyInfo';
import SpeechSpeed from '../components/speechSpeed';
import Question from "../components/QuestionModal";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Speech from 'expo-speech';
import { NavigationContainer } from '@react-navigation/native';
import ReactTimeout from 'react-timeout'

import { LinearGradient } from 'expo-linear-gradient';
// import AsyncStorage from '@react-native-async-storage/async-storage';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

class GameScreen extends Component {

  possibleColors = {
    'neutral': ['#FFC917', '#21EBE4'],
    'correct': ['#FFC917', '#03f215'],
    'incorrect': ['#FFC917', 'red'],
  }  
    state = {
        answerText: '',
        questionText: '',
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
        speechSpeedModalIsVisible: false,
        useSpeech: true,
        speechSpeed: 1,
        questionSentences: [],
        currentSentence: 0,
        currentWordInSentence: 0,
        setenceTimer: null,
        colorsToUse: this.possibleColors.neutral,
        switchingQuestions: false,
        answerViewVisible: false,
        setenceTimer: null,
        showBuzzer: true,
        
        whichVoice: undefined,
        showQuestionView: false,
    }
   constructor(){
    super()
    
    
    this.startGame = this.startGame.bind(this)
    this.tick = this.tick.bind(this)
    this.switchToInfoAboutDifficult = this.switchToInfoAboutDifficult.bind(this)
    // this.useSpeechQuestionStarter = this.useSpeechQuestionStarter.bind(this)
    this.prepQuestion = this.prepQuestion.bind(this)
        this.switchToWelcome = this.switchToWelcome.bind(this);
        this.startup = this.startup.bind(this);
        this.switchQuestion = this.switchQuestion.bind(this)
   }
    
   startup(){
    console.log("PLS")
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
      speechSpeedModalIsVisible: false,
      useSpeech: true,
      questionSentences: [],
      currentSentence: 0,
      currentWordInSentence: 0,
      setenceTimer: null,
      switchingQuestions: false,
      answerViewVisible: false,
      setenceTimer: null,
      showBuzzer: true,
      showQuestion: true,
      colorsToUse: this.possibleColors.neutral,
      
  }
  }
    
  
  switchToInfoAboutDifficult(){
    this.setState({
      gameDiffultyInfoModalIsVisible: !this.state.gameDiffultyInfoModalIsVisible,
      gameSettingsModalIsVisible: !this.state.gameSettingsModalIsVisible,

    })
  };
  switchToInfoAboutSpeechSpeed() {
    this.setState({
      speechSpeedModalIsVisible: !this.state.speechSpeedModalIsVisible,
      gameSettingsModalIsVisible: !this.state.gameSettingsModalIsVisible,
    })
  };
  switchToWelcome(){
    console.log(this.props);
    this.setState({
      gameSettingsModalIsVisible : false
    })
    this.props.navigation.push("Welcome");
    // this.setState({
    //   gameSettingsModalIsVisible : true
    // })
  }
  switchQuestion(){
    if(this.state.currentQuestion == this.state.currentQuestions.length){
      this.props.navigation.push("Welcome");
    }else{
      this.setState({
        showQuestionView:false
      })
      this.prepQuestion()
    }
  }
  prepQuestion(){
    // if(await Speech.isSpeakingAsync()){
    //   console.log(this.state.switchingQuestions)
    //   await Speech.stop();
    // }
    // if(this.state.currentQuestion == 0){
      // console.log(await Speech.stop())
      // console.log(await Speech.isSpeakingAsync())
      var question = this.state.currentQuestions[this.state.currentQuestion];
      
      if(this.state.currentQuestion != 0){
        this.state.questionSentences = [...question.question.join(" ").split(".")];
      }else{
        this.state.questionSentences = [...question.question.join(" ").split(".")];
      }
      this.setState({
        showQuestionView: true,
      })
    // this.sentenceSpeakerHandler();
    // this.questionText = "";
    // }
  }
  
  tick(){
    // console.log(this.state.currentQuestions);
    if(this.state.runQuestion && this.state.currentWordsInQuestion < this.state.currentQuestions[this.state.currentQuestion].question.length){
        this.setState({questionText:this.state.questionText + " " + this.state.currentQuestions[this.state.currentQuestion].question[this.state.currentWordsInQuestion]});
        this.state.currentWordsInQuestion = this.state.currentWordsInQuestion + 1;

    }
  };
  
  // useSpeechQuestionStarter(){
  //   if(this.state.runQuestion && this.state.currentWordsInQuestion < this.state.currentQuestions[this.state.currentQuestion].question.length){
  //     this.setState({questionText:this.state.questionText + " " + this.state.currentQuestions[this.state.currentQuestion].question[this.state.currentWordsInQuestion]});
  //   }
  // }
  
  startGame(questions,speechSpeed){
    this.setState({
      currentQuestions: questions,
      speechSpeed: speechSpeed
    });
    // const voice = async () => {
    //   try {
    //     const value = await AsyncStorage.getItem('@voiceToUse');
    //     if(value !== null) {
    //       return value;
    //     }
    //   } catch(e) {
    //     return null
    //   }
    // }
    console.log(this.state.currentQuestions);
    this.state.currentQuestion=0;
    // this.state.questionText = "";
    // console.log(questions[0].question.join(" "));
    // console.log(questions[0].answer);
    this.setState({
      gameSettingsModalIsVisible: false,
    });
    this.prepQuestion();
    
    // if(!this.state.useSpeech){
    //   this.state.runQuestion = true;
    //   let timer = setInterval(this.tick, 500/this.state.speechSpeed);
    //   this.state.timerState = timer;
    // }else{
    //   this.state.runQuestion = true;
    //   // this.useSpeechQuestionStarter();
      
    //   this.prepQuestion(questions[0]);
    //   this.state.setenceTimer = setInterval(this.tickSentence, 300/this.state.speechSpeed);
    // }
    // // this.tick()
  }
  
  render (){
    return (
    <LinearGradient
      colors={this.state.colorsToUse}
      style={styles.container}>
      <View style={styles.overallContainer}>
        {this.state.showQuestionView  &&

        <Question 
        
        // dismiss={(result)=>{
        //   console.log(result);
        // }} 
        visible={this.state.showQuestion} 
        switchVisible={() =>{ 
          this.setState({
          showQuestion: !this.state.showQuestion,
        })
      } 
        }
        finishQuestion={
          (result) =>{
          this.setState({
            colorsToUse: result.colorsToUse,
            score: result.newScore,
            
          })
          console.log(this.state.score)
          this.state.currentQuestions[this.state.currentQuestion]["result"] = result.answer
          this.state.currentQuestion +=1
          this.switchQuestion()
          }
        }
        colorsToUse={this.state.colorsToUse}
        speechSpeed={this.state.speechSpeed}
        sentences={this.state.questionSentences}
        score={this.state.score} 
        currentQuestion={this.state.currentQuestion} 
        question={this.state.currentQuestions[this.state.currentQuestion]} />
        
        }
         
      <StartGameOverview visible={this.state.gameSettingsModalIsVisible} switchToWelcome={this.switchToWelcome} switchToInfoAboutDifficult={()=>{
        this.switchToInfoAboutDifficult();
        console.log("switch")

        }} startGame={this.startGame}/>
        <GameDifficultyInfo visible={this.state.gameDiffultyInfoModalIsVisible} switchModals={this.switchToInfoAboutDifficult} />
        <SpeechSpeed visible={this.state.speechSpeedModalIsVisible} switchModals={this.switchToInfoAboutSpeechSpeed} />
      </View>

      <StatusBar style="auto" />
    </LinearGradient>
    );
  };
}

export default GameScreen;

const styles = StyleSheet.create({
    buzzerButton: {
      height: 40,
      width: width / 3,
      backgroundColor: 'yellow',
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      bottom: 0,
    },
    buzzText: {
      fontSize: 20,
      color: 'blue',
    },
    container: {
      flex: 1,
      backgroundColor: 'orange',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 50,
      flexDirection: 'column'
    },
    subtitleText: {
      fontSize: 28,
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      paddingTop: 5,
      paddingBottom: 10,
    },  
    textInput: {
      padding: 20,
      fontSize: 30,
      color: 'white'
    },
    textInputContainer: {
      resizeMode: 'contain',
      backgroundColor: 'black',
      borderRadius: 15,
      bottom: 100
    },
    titleText: {
      fontSize: 32,
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      paddingTop: 10,
    },
    titleTextContainer: {
      position: 'absolute',
      top: 10
    },
    overallContainer: {
      flex:1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    questionView: {
      backgroundColor: 'black',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 5,
      borderRadius: 15,
    }, 
    submitAnswerContainer: {
      alignItems: 'center',
    },
    submitButton: {
      resizeMode: 'contain',
      width: width / 2.4,
      backgroundColor: '#ef6ef7',
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      bottom: 50,
    },
    submitText: {
      fontSize: 40,
      color: '#3d02d4',
      padding: 10,
    },
    answerView:{
      flex:1,
    }
  });
  