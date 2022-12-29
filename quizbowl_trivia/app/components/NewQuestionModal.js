import React, {useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TextInput, Alert,Vibration, Pressable, Dimensions, Modal, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { incrementSentence, incrementWordInSentence, resetGame, setCurrentQuestionText, setRunQuestion,resetWordInSentence,setIsUpdating, incrementPointsByAmount, setCurrentColor, incrementQuestion, setQuestionUserAnswer } from '../../features/game/gameSlice';
import { Icon, Button, ButtonGroup, withTheme} from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import LastQuestionInfo from './LastQuestionInfo';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const NewQuestion = (props) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const currentQuestion = useSelector(state => state.game.currentQuestion);
    useEffect(() => {
      if(currentQuestion === gameQuestions.length -1){   
      props.switchToEndOfRound();
      }
    }, [currentQuestion]);
    
    const gameQuestions = useSelector(state => state.game.gameQuestions);
    // const showQuestion = useSelector(state => state.game.showQuestion);
    const [showQuestion, setShowQuestion] = useState(true);
    const currentColor = useSelector(state => state.game.currentColor);
    const points = useSelector((state) => state.game.points);
    const currentQuestionText = useSelector((state) => state.game.currentQuestionText);
    const runQuestion = useSelector(state => state.game.runQuestion);
    const [showBuzzer,setShowBuzzer] = useState(true);
    const [answerViewVisible, setAnswerViewVisible] = useState(false);
    const [answerText, setAnswerText] = useState("");
    const [showAnswerInfo, setShowAnswerInfo] = useState(false);
    // console.log("currentQuestion: ", currentQuestion)
    // console.log("gameQuestions: ", gameQuestions[currentQuestion].question)
    
    const sentences = () => {return gameQuestions[currentQuestion].question.join(" ").split(". ")}
    const currentWordInSentence = useSelector((state) => state.game.currentWordInSentence);
    const currentSentence = useSelector((state) => state.game.currentSentence);
    const speechSpeed = useSelector((state) => state.game.speechSpeed);
    const isUpdating = useSelector((state) => state.game.isUpdating);
    const buzz = () => {
        Vibration.vibrate(1000);
        dispatch(setRunQuestion(false));
        try{
          Speech.stop();
        }catch (e) {
            console.log(e)
        }
        setAnswerViewVisible(true);
        setShowQuestion(false);
        setShowBuzzer(false);
    }
    // useEffect(() => {
    //   dispatch(resetQuestion());
    // }, [])
    
    const sentenceSpeakerHandler = ()=>{
        // if(this.state.switchingQuesitons){
        //   console.log("switching questions")
        //   return false;
        // }
        if(!runQuestion){
          return false;
        }
        if(currentSentence < sentences().length){
            console.log(String(sentences()[currentSentence]))
          Speech.speak(String(sentences()[currentSentence]),{
            language: 'en-US',
            pitch: 1,
            rate: speechSpeed,
            // voice: this.state.whichVoice,
            onStart: () => {
              
            },onStopped:() =>{
              console.log("stopped")
    
            }
            ,
            onDone: () => {
            //   if(this.state.switchingQuestions){
            //     console.log("switching questions")
            //     return false;
            //   }
              dispatch(incrementSentence());
              dispatch(resetWordInSentence())
              // sentenceSpeakerHandler();

              return true;
            },
            onError: (error) => {
                console.log(error)
                }
    
          });
        }
      }
      const finishQuestion = (result)=>{
        if(result[0]){
          var words_bonus= currentQuestionText.split(" ").length < 40 ? (40 - currentQuestionText.split(" ").length) : 0;
          // setPoints = score + words_bonus + 10;
          dispatch(incrementPointsByAmount(words_bonus + 10));
          // this.state.colorsToUse = this.possibleColors["correct"]
          dispatch(setCurrentColor("correct"))
        }else{
          // this.state.colorsToUse = this.possibleColors["incorrect"]
          dispatch(setCurrentColor("incorrect"))
          dispatch(incrementPointsByAmount(0));
        }

        dispatch(setQuestionUserAnswer(answerText));
        setAnswerText("")
          dispatch(setRunQuestion(true));
          dispatch(incrementQuestion());
          dispatch(setCurrentQuestionText(""));
        // this.state.answerText = '';
        // if (this.state.currentQuestion === this.state.currentQuestions.length -1){
        //   // this.state.gameSettingsModalIsVisible = true
        //   this.props.navigation.push('Welcome');
          
        // }else{
        //   this.state.currentQuestion = this.state.currentQuestion + 1;
        //   this.state.questionText = "";
        //   console.log("Prepping Question")
        //   this.state.
        // //   this.prepQuestion(this.state.currentQuestions[this.state.currentQuestion]); 
        // }
        // this.props.finishQuestion({
        //     colorsToUse:this.state.colorsToUse,
        //     correctOrNot: result[0],
        //     correctAnswer:result[1],
        //     newScore:this.state.score
        // })
      }
      
      
      const submitAnswer = ()=>{
        console.log(answerText);
        // this.setState({
        //   showQuestion: false,
        //   showBuzzer: false,
        //   answerViewVisible: false,
        // })
        setShowQuestion(false);
        setShowBuzzer(false);
        setAnswerViewVisible(false);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
          "answer": answerText,
          "serverAnswer": gameQuestions[currentQuestion].answer,
          "questionId": gameQuestions[currentQuestion].questionId
        });
        console.log(raw)
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
        // this.setState({
        //   showBuzzer: true,
        //   showQuestion: true,
        // })
        setShowBuzzer(true);
        setShowQuestion(true);
        if (Speech.isSpeakingAsync()){
          Speech.stop().then((val) => {
            console.log(val)
            finishQuestion([result["correctOrNot"],result["correctAnswer"]])
          })
        }else{
          finishQuestion([result["correctOrNot"],result["correctAnswer"]])
        }
      })
      .catch(error => {
        Alert.alert("Error", "Could not submit answer")
        console.log('error', error)});

        
      }
    const tickSentence = ()=>{ // this should add a word to the sentence
        // console.log(sentences())
        
        // console.log(sentences()[currentSentence].split(" ").length)
        console.log(isUpdating)
        if(isUpdating === false){
            dispatch(setIsUpdating(true));
        }else if (tickSentence.isRunning === true){
            return false;
        }
        if (runQuestion !== true){
            return false;
          }
          if(sentences().length === 0){
            return false;
        }
        if(currentSentence >= sentences().length){
            return false;
        }

        // console.log(this.props.speechSpeed);
        // console.log(this.state.currentSentence);
        if(runQuestion && currentWordInSentence < sentences()[currentSentence].split(" ").length){
            // this.setState({questionText:this.state.questionText + " " + this.props.sentences[this.state.currentSentence].split(" ")[this.state.currentWordInSentence]});

            // this.state.currentWordInSentence = this.state.currentWordInSentence + 1;
            // all old sentences plus the new sentence till the new word
            // displayWords = sentences.slice(0,currentSentence).join(".  ")  + sentences[currentSentence].split(" ").slice(0,currentWordInSentence).join(" ");
            // console.log(sentences().slice(0,currentSentence).join(".  ")  + sentences()[currentSentence].split(" ").slice(0,currentWordInSentence).join(" "))
            // dispatch(incrementWordInSentence());
            setTimeout(()=>{
                if (currentSentence > 0){
                dispatch(setCurrentQuestionText(sentences().slice(0,currentSentence).join(".  ")+ ".  "  + sentences()[currentSentence].split(" ").slice(0,currentWordInSentence + 1).join(" ")));
                }else{
                dispatch(setCurrentQuestionText(sentences()[currentSentence].split(" ").slice(0,currentWordInSentence + 1).join(" ")));
                }
                dispatch(setIsUpdating(false));
                dispatch(incrementWordInSentence());
            },300/speechSpeed)
            // console.log(currentSentence,currentWordInSentence)

            if(currentWordInSentence === sentences()[currentSentence].length){
              dispatch(setCurrentQuestionText(currentQuestionText + ".  "));
            }
        }
    }
    
    useEffect(()=>{
      sentenceSpeakerHandler();
      // const tickInterval = setInterval(()=>{tickSentence()}, 1000);
      // return () => clearInterval(tickInterval);
    },[currentSentence,currentQuestion])
    useEffect(()=>{
      tickSentence();
    },[currentSentence,currentWordInSentence,currentQuestion])
    console.log(currentWordInSentence)
    return (
        <Modal 
        // onDismiss={
        //      async()=>{
        //         while(await Speech.isSpeakingAsync()==true ){
        //     }
        //     this.props.dismiss("Cats")}
        // }
         visible={true}
        animationType="none">
        <LinearGradient
        colors={currentColor}
        style={styles.container}>
        
        <View style={styles.overallContainer}>
        {showAnswerInfo ? (
          <LastQuestionInfo/>
          ) : null}
        {!showAnswerInfo && 
        <SafeAreaView style={styles.overallContainer}>
          <Button
            type="clear"    
            title="End Round"
            titleStyle={{color: 'white'}} 
            containerStyle={{ width: width, marginRight: 15, alignItems: 'flex-end', borderRadius: 15}}
            buttonStyle={{borderWidth: 0, backgroundColor: '#381bf0', borderRadius: 15
            }}        
            icon={{name: 'arrow-right', type: 'font-awesome', size: 15, color: 'white'}}
            iconRight
            raised
            onPress={() => {props.switchToEndOfRound()}  }  
          />
          <Text style={styles.titleText}>Score: {points}</Text>
          <Text style={styles.subtitleText}>Question: {currentQuestion +1}</Text>  
          {/* <Button onPress={()=>{
              this.props.switchVisible();
            }} title=" This should work"/> */}
        <ScrollView>
                    
        {showQuestion ? (
          <>
            { currentQuestion > 0 &&  (
              <Button type="clear" style={styles.questionView}
              onPress={() => {
                Speech.stop();
                dispatch(setRunQuestion(false));
                setShowAnswerInfo(true);
                setShowBuzzer(false);
                setAnswerViewVisible(false);
                setShowQuestion(false);
              }}
            >
              <Text style={{padding: 10, color: 'white'}}>Last Question Answer: {currentQuestion > 0 ? gameQuestions[currentQuestion-1].answer : ""}</Text>    
            </Button>
            ) }
      <View style={[styles.questionView, {marginTop: 20}]}>  
        <Text style={{padding: 10, color: 'white', fontSize: 15}}>
          {currentQuestionText}
        </Text>
      </View>
      </>
      ) : null}
      </ScrollView>
      <View style={[styles.answerView, {top: 0}]}>
        {showBuzzer ? (
          <Pressable onPress={buzz}>
            <View style={[styles.buzzerButton, {marginTop: 10}]}>    
            <Text style={styles.buzzText}>Buzz</Text>
            </View>
          </Pressable>
        ) : null}
        {answerViewVisible &&
        <View style={{top: -100}}>
          <View style={[styles.textInputContainer]}>
            <TextInput onChangeText={(val)=>{setAnswerText(val)}} value={answerText} placeholder='Write your answer here' placeholderTextColor='#bcbcbc' style={styles.textInput} />
          </View>
          <Pressable onPress={submitAnswer}>
            <View style={styles.submitAnswerContainer}>     
            <View style={styles.submitButton}>
              <Text style={styles.submitText}>Submit</Text>
            </View>
            </View>
          </Pressable>      
        </View>
        }
        
        
        
      </View>
        </SafeAreaView> 
        }
        </View>  
        </LinearGradient>
        </Modal>
    )
}

export default NewQuestion;


const styles = StyleSheet.create({
    buzzerButton: {
      height: 40,
      width: '300%',
      backgroundColor: 'yellow',
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      bottom: 0,
      right: width/8,
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
      flexDirection: 'column',
      alignItems: 'center',
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
      margin: 0,
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
