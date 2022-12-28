import React, {useEffect, useRef, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import {setGameQuestions,incrementPointsByAmount,incrementQuestion,resetGame,setSpeechSpeed,addAnswer, setShowQuestion, setCurrentColor,setCurrentQuestion} from '../../features/game/gameSlice';
import NewQuestion from '../components/NewQuestionModal';
import CategoriesScreen from './CategoriesScreen';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const GameScreen = (props) => {

    dispatch = useDispatch();
    const showQuestion = useSelector(state => state.game.showQuestion);
    const currentColor = useSelector(state => state.game.currentColor);
    const currentQuestion = useSelector(state => state.game.currentQuestion);
    const gameQuestions = useSelector(state => state.game.gameQuestions);
    // useEffect(() => {
    // dispatch(setCurrentColor('incorrect'));
    // }, []);
    // const [answerText, setAnswerText] = useState('');
    // const [questionText, setQuestionText] = useState('');
    // // const currentQuestions = useRef(null);
    // const [currentQuestions, setCurrentQuestions] = useState(null);
    const [gameSettingsModalIsVisible, setGameSettingsModalIsVisible] = useState(true);
    // const currentQuestion = useRef(0);
    // const [runQuestion, setRunQuestion] = useState(false);
    // const [score, setScore] = useState(0);
    // const [round, setRound] = useState(1);
    // const [showQuestion, setShowQuestion] = useState(false);
    // const [currentWordsInQuestion, setCurrentWordsInQuestion] = useState(0);
    // const [timerState, setTimerState] = useState(null);
    // const [gameTicks, setGameTicks] = useState(0);
    const [gameDiffultyInfoModalIsVisible, setGameDiffultyInfoModalIsVisible] = useState(false);
  const [speechSpeedModalIsVisible, setSpeechSpeedModalIsVisible] = useState(false);
  const [categoryPickerIsVisible, setCategoryPickerIsVisible] = useState(false);
    // const [useSpeech, setUseSpeech] = useState(true);
    // const [speechSpeed, setSpeechSpeed] = useState(1);
    // const questionSentences = useRef([]);
    // const [currentSentence, setCurrentSentence] = useState(0);
    // const [currentWordInSentence, setCurrentWordInSentence] = useState(0);
    // const [setenceTimer, setSetenceTimer] = useState(null);
    // const [colorsToUse, setColorsToUse] = useState(possibleColors.neutral);
    // const [switchingQuestions, setSwitchingQuestions] = useState(false);
    // const [answerViewVisible, setAnswerViewVisible] = useState(false);
    // const [showBuzzer, setShowBuzzer] = useState(true);
    // const [whichVoice, setWhichVoice] = useState(undefined);
    // const showQuestionView = useRef(false);
    // const [lastQuestionAnswer, setLastQuestionAnswer] = useState("");
  
  
  function switchToInfoAboutDifficult(){
    setGameDiffultyInfoModalIsVisible(!gameDiffultyInfoModalIsVisible);
    setGameSettingsModalIsVisible(!gameSettingsModalIsVisible);
  };
  function switchToInfoAboutSpeechSpeed() {
    setSpeechSpeedModalIsVisible(!speechSpeedModalIsVisible);
    setGameSettingsModalIsVisible(!gameSettingsModalIsVisible);
  };
  function switchToWelcome(){
    console.log(props);
    setGameSettingsModalIsVisible(false);
    props.navigation.push("Welcome");
  }
  function switchToCategories(){
    console.log(props);
    setGameSettingsModalIsVisible(false);
    setCategoryPickerIsVisible(true);
    // props.navigation.push("Categories");
  }
  function switchToEndOfRound() {
    console.log(props);
    dispatch(setShowQuestion(false)); 
    dispatch(setCurrentQuestion(gameQuestions.length))
    props.navigation.push("End Of Round");
  }
  function switchToSettingsVisible() {
    setCategoryPickerIsVisible(false);
    setGameSettingsModalIsVisible(true);
  }
  // function switchQuestion(){
  //   if (currentQuestions == null){
  //     return
  //   }
  //   if(currentQuestion.current == currentQuestions.length){
  //     console.log("WE IS OvER THERE");
  //     showQuestionView.current = false;
  //     props.navigation.navigate("End Of Round", {currentQuestions: currentQuestions, score: score});
  //   }else{
  //     showQuestionView.current = false;
  //     prepQuestion()
  //   }
  // }
  // function prepQuestion(){
  //     const question = currentQuestions[currentQuestion.current];
  //     if(currentQuestion.current != 0){
  //       questionSentences.current = [...question.question.join(" ").split(".")];
  //     }else{
  //       questionSentences.current = [...question.question.join(" ").split(".")];
  //     }
  //     console.log(questionSentences.current)
  //     console.log([...question.question.join(" ").split(".")])
  // }
  
  // function tick(){
  //   if(runQuestion && currentWordsInQuestion < currentQuestions[currentQuestion.current].question.length){
  //       setQuestionText(questionText + " " + currentQuestions[currentQuestion.current].question[currentWordsInQuestion]);
  //       setCurrentWordsInQuestion(currentWordsInQuestion + 1);
  //   }
  // };
  
  const startGame = (questions,speechSpeed) => {
    // scramble questions
    dispatch(resetGame());
    questions = questions.sort(() => Math.random() - 0.5);
    dispatch(setGameQuestions(questions));
    // setCurrentQuestions(questions);
    dispatch(setSpeechSpeed(speechSpeed));
    setGameSettingsModalIsVisible(false);
    dispatch(setShowQuestion(true));

    // prepQuestion();
  }
    return (
    <LinearGradient
      colors={currentColor}
      style={styles.container}>
      <View style={styles.overallContainer}>
        { showQuestion && currentQuestion < gameQuestions.length &&
        <NewQuestion switchToEndOfRound={()=>{switchToEndOfRound()}} navigation={props.navigation}></NewQuestion>

        }
        {/* {showQuestion   &&
        <Question 
        visible={true} 
        switchVisible={() =>{ 
        dispatch(setShowQuestion(!showQuestion));
      } 
        }
        finishQuestion={
          (result) =>{
          setColorsToUse(result.colorsToUse);
          console.log(score)
          currentQuestions[currentQuestion.current]["result"] = result.correctOrNot;
          currentQuestions[currentQuestion.current]["serverAnswer"] = result.correctAnswer;
          // currentQuestion.current = currentQuestion.current + 1;
          dispatch(incrementQuestion());
          setLastQuestionAnswer(result.correctAnswer);
          switchQuestion()
          }
        }
        colorsToUse={colorsToUse}
        lastQuestionAnswer={lastQuestionAnswer}
        speechSpeed={speechSpeed}
        sentences={[...currentQuestions[currentQuestion.current].question.join(" ").split(".")]}
        score={score} 
        currentQuestion={currentQuestion.current} 
        question={currentQuestions[currentQuestion.current]} />
        
        } */}
          <CategoriesScreen visible={categoryPickerIsVisible} switchToSettings={switchToSettingsVisible}></CategoriesScreen>
      <StartGameOverview visible={gameSettingsModalIsVisible} switchToWelcome={switchToWelcome} switchToCategories={switchToCategories} switchToInfoAboutDifficult={()=>{
        switchToInfoAboutDifficult();
        console.log("switch")    
        }} startGame={startGame}/>
        <GameDifficultyInfo visible={gameDiffultyInfoModalIsVisible} switchModals={switchToInfoAboutDifficult} />
        <SpeechSpeed visible={speechSpeedModalIsVisible} switchModals={switchToInfoAboutSpeechSpeed} />
      </View>

      <StatusBar style="auto" />
    </LinearGradient>
    );
  };
// }

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
    subtitconstext: {
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
    titconstext: {
      fontSize: 32,
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      paddingTop: 10,
    },
    titconstextContainer: {
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
  