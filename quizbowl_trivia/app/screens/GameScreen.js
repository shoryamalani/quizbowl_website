import React, { Component, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TextInput, Button,Alert,Vibration } from 'react-native';
import StartGameOverview from '../components/startGameOverview';
import GameDifficultyInfo from '../components/gameDifficultyInfo';
import SpeechSpeed from '../components/speechSpeed';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import ReactTimeout from 'react-timeout'
import * as Speech from 'expo-speech';
import { LinearGradient } from 'expo-linear-gradient';

class GameScreen extends Component {

  possibleColors = {
    'neutral': ['#FFC917', '#21EBE4'],
    'correct': ['#FFC917', 'green'],
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
        questionSentences: [],
        currentSentence: 0,
        currentWordInSentence: 0,
        setenceTimer: null,
        colorsToUse: this.possibleColors.neutral,
        switchingQuestions: false,
        answerViewVisible: false,
        setenceTimer: null,
        showBuzzer: true,
    }
   constructor(){
    super()
    
    this.changeAnswerText = this.changeAnswerText.bind(this)
    this.submitAnswer = this.submitAnswer.bind(this)
    this.startGame = this.startGame.bind(this)
    this.tick = this.tick.bind(this)
    this.switchToInfoAboutDifficult = this.switchToInfoAboutDifficult.bind(this)
    // this.useSpeechQuestionStarter = this.useSpeechQuestionStarter.bind(this)
    this.sentenceSpeakerHandler = this.sentenceSpeakerHandler.bind(this)
    this.completeWordHandler = this.completeWordHandler.bind(this)
    this.tickSentence = this.tickSentence.bind(this)
    this.prepQuestion = this.prepQuestion.bind(this)
    this.switchToWelcome = this.switchToWelcome.bind(this);
    this.startup = this.startup.bind(this);
    this.buzz = this.buzz.bind(this);
    this.finishQuestion = this.finishQuestion.bind(this);
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
      
  }
  }
    
  changeAnswerText(text){
    this.state.answerText = text;
    console.log(text);
  };
  
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
      this.state.runQuestion = true;
      // this.useSpeechQuestionStarter();
      
      this.prepQuestion(questions[0]);
      this.state.setenceTimer = setInterval(this.tickSentence, 300);
    }
    // this.tick()
  }
  sentenceSpeakerHandler(){
    if(this.state.switchingQuesitons){
      return false;
    }
    if(this.state.currentSentence < this.state.questionSentences.length){
      Speech.speak(String(this.state.questionSentences[this.state.currentSentence]),{
        language: 'en-US',
        pitch: 1,
        rate: 1,
        onStart: () => {
          this.state.runQuestion = true;
          
        },onStopped:() =>{
          console.log("stopped")

        }
        ,
        onDone: () => {
          if(this.state.switchingQuestions){
            console.log("switching questions")
            return false;
          }
          this.state.runQuestion = false;
          
          this.completeWordHandler();
          return true;
        }
      });
    }
  }
  async prepQuestion(question){
    // if(await Speech.isSpeakingAsync()){
    //   console.log(this.state.switchingQuestions)
    //   await Speech.stop();
    // }
    // if(this.state.currentQuestion == 0){
      // console.log(await Speech.stop())
      while((await Speech.isSpeakingAsync())==true ){
      }
      console.log("WERE OVER HERE")
      console.log(await Speech.isSpeakingAsync())
      console.log(question.question)
      this.state.switchingQuesitons = false;
      this.state.currentWordsInQuestion = 0;
      this.state.currentSentence = 0;
      if(this.state.currentQuestion != 0){
        this.state.questionSentences = ['',...question.question.join(" ").split(".")];
      }else{
        this.state.questionSentences = [...question.question.join(" ").split(".")];
      }
    this.sentenceSpeakerHandler();
    this.questionText = "";
    // }
  }
  tickSentence(){ // this should add a word to the sentence

    if (this.state.runQuestion !== true){
      return false;
    }
    if(this.state.questionSentences[this.state.currentQuestion] == undefined){
      return false;
    }
    console.log(this.state.currentSentence);
    if(this.state.runQuestion && this.state.currentWordInSentence < this.state.questionSentences[this.state.currentSentence].split(" ").length){
      this.setState({questionText:this.state.questionText + " " + this.state.questionSentences[this.state.currentSentence].split(" ")[this.state.currentWordInSentence]});
      this.state.currentWordInSentence = this.state.currentWordInSentence + 1;
      if(this.state.currentWordInSentence === this.state.questionSentences[this.state.currentSentence].split(" ").length){
        this.state.questionText = this.state.questionText + ".";
      }
    }
  }
  completeWordHandler(){
    console.log("completing")
    console.log(this.state.switchingQuestions)
    if(this.state.switchingQuestions == true){
      console.log("switching questions")
      return false;
    }
    if(this.state.currentWordInSentence === this.state.currentSentence.length){
      this.state.currentWordInSentence = 0;
    }else{
      this.state.questionText = this.state.questionSentences.slice(0,this.state.currentSentence+1).join(".") + ".";
      this.state.currentWordInSentence = 0;
    }
    if(this.state.currentSentence < this.state.questionSentences.length){
      this.state.currentSentence = this.state.currentSentence + 1;
      if(this.state.switchingQuestions == false){
        this.sentenceSpeakerHandler()
      }
    }
  }
  buzz(){
    this.setState({
      showBuzzer: false,
      runQuestion: false,
      answerViewVisible: true,
    })

    if(this.state.useSpeech && Speech.isSpeakingAsync()){
      Speech.pause();
    }
    Vibration.vibrate();

  }
  finishQuestion(result){
    console.log(result)
    if(result){
      console.log(typeof this.state.questionText.split(" ").length)
      words_bonus= this.state.questionText.split(" ").length < 40 ? (40 - this.state.questionText.split(" ").length) : 0;
      console.log(words_bonus)
      this.state.score = this.state.score + words_bonus + 10;
      this.state.colorsToUse = this.possibleColors["correct"]
    }else{
      this.state.colorsToUse = this.possibleColors["incorrect"]
    }
    this.state.answerText = '';
    if (this.state.currentQuestion === this.state.currentQuestions.length){
      this.state.gameSettingsModalIsVisible = true
      
    }else{
      this.state.currentQuestion = this.state.currentQuestion + 1;
      this.state.questionText = "";
      console.log(this.state.currentQuestions[this.state.currentQuestion].answer);
      if(this.state.useSpeech){
        this.prepQuestion(this.state.currentQuestions[this.state.currentQuestion]);
      }
    }
  }
  submitAnswer(){
    console.log(this.state.answerText);
    this.setState({
      showBuzzer: false,
      answerViewVisible: false,
      switchingQuesitons: true,
    })
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      "answer": this.state.answerText,
      "serverAnswer": this.state.currentQuestions[this.state.currentQuestion].answer,
      "questionId": 12
    });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://quizbowl.shoryamalani.com/check_answer", requestOptions)
  .then(response => response.text())
  .then(result => {
    console.log(result);
    var result = JSON.parse(result)
    this.setState({
      showBuzzer: true,
    })
    if (this.state.useSpeech && Speech.isSpeakingAsync()){
      Speech.stop().then((val) => {
        console.log(val)
        this.finishQuestion(result["correctOrNot"])
      })
    }else{
      this.finishQuestion(result["correctOrNot"])
    }
  })
  .catch(error => console.log('error', error));
    
  }
  render (){
    return (
    <LinearGradient
      colors={this.state.colorsToUse}
      style={styles.container}>
      <View style={styles.overallContainer}>
        <View style={styles.titleTextContainer}>
          <Text style={styles.titleText}>Score:{this.state.score}</Text>
          <Text style={styles.subtitleText}>Question {this.state.currentQuestion}</Text>  
        </View>    
      <StartGameOverview visible={this.state.gameSettingsModalIsVisible} switchToWelcome={this.switchToWelcome} switchToInfoAboutDifficult={()=>{
        this.switchToInfoAboutDifficult();
        console.log("switch")

        }} startGame={this.startGame}/>
        <GameDifficultyInfo visible={this.state.gameDiffultyInfoModalIsVisible} switchModals={this.switchToInfoAboutDifficult} />
        <SpeechSpeed visible={this.state.speechSpeedModalIsVisible} switchModals={this.switchToInfoAboutSpeechSpeed} />
      </View>
      <View style={styles.questionView}>
        <Text style={{padding: 10, color: 'white'}}>
          {this.state.questionText}
        </Text>
      </View>
      <View style={styles.answerView}>
    {this.state.showBuzzer ? (<Button title="Buzz" onPress={this.buzz}/>):null}
        {this.state.answerViewVisible &&
        <View>
        <TextInput onChangeText={this.changeAnswerText} value={this.answerText} placeholder='answer' />
        <Button title='Submit' onPress={this.submitAnswer} />
        </View>
        }
      </View>
      <StatusBar style="auto" />
    </LinearGradient>
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
    subtitleText: {
      fontSize: 28,
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      paddingTop: 5,
      paddingBottom: 10,
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
    answerView:{
      flex:1,
    }
  });
  