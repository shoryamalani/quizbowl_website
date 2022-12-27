import React, {useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TextInput, Alert,Vibration, Pressable, Dimensions, Modal, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { setCurrentQuestionText, setRunQuestion } from '../../features/game/gameSlice';
import { Icon, Button, ButtonGroup, withTheme} from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const NewQuestion = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const currentQuestion = useSelector(state => state.game.currentQuestion);
    const gameQuestions = useSelector(state => state.game.gameQuestions);
    // const showQuestion = useSelector(state => state.game.showQuestion);
    const [showQuestion, setShowQuestion] = useState(true);
    const currentColor = useSelector(state => state.game.currentColor);
    const points = useSelector(state => state.game.points);
    const currentQuestionText = useSelector(state => state.game.currentQuestionText);
    const runQuestion = useSelector(state => state.game.runQuestion);
    const [showBuzzer,setShowBuzzer] = useState(true);
    const [answerViewVisible, setAnswerViewVisible] = useState(false);
    const [answerText, setAnswerText] = useState("");
    console.log("currentQuestion: ", currentQuestion)
    console.log("gameQuestions: ", gameQuestions[currentQuestion].question)
    const sentences = gameQuestions[currentQuestion].question.join(" ").split(".  ");
    const buzz = () => {
        Vibration.vibrate(1000);
        dispatch(setRunQuestion(false));
        setAnswerViewVisible(true);
        setShowQuestion(false);
        setShowBuzzer(false);
        

    }
    const submitAnswer = (answer) => {
        console.log("answer: ", answer);
    }
    const sentenceSpeakerHandler = ()=>{
        // if(this.state.switchingQuesitons){
        //   console.log("switching questions")
        //   return false;
        // }
        
        if(this.state.currentSentence < this.props.sentences.length){
            console.log(String(this.props.sentences[this.state.currentSentence]))
          Speech.speak(String(this.props.sentences[this.state.currentSentence]),{
            language: 'en-US',
            pitch: 1,
            rate: this.props.speechSpeed,
            // voice: this.state.whichVoice,
            onStart: () => {
              this.state.runQuestion = true;
              console.log("Starting to speek")
              
            },onStopped:() =>{
              console.log("stopped")
    
            }
            ,
            onDone: () => {
            //   if(this.state.switchingQuestions){
            //     console.log("switching questions")
            //     return false;
            //   }
              this.state.runQuestion = false;
              
              this.completeWordHandler();
              return true;
            },
            onError: (error) => {
                console.log(error)
                }
    
          });
        }
      }
      
    const tickSentence = ()=>{ // this should add a word to the sentence

        if (this.state.runQuestion !== true){
            return false;
        }
        if(this.props.sentences == []){
            return false;
        }
        // console.log(this.props.speechSpeed);
        // console.log(this.state.currentSentence);
        if(this.state.runQuestion && this.state.currentWordInSentence < this.props.sentences[this.state.currentSentence].split(" ").length){
            this.setState({questionText:this.state.questionText + " " + this.props.sentences[this.state.currentSentence].split(" ")[this.state.currentWordInSentence]});

            this.state.currentWordInSentence = this.state.currentWordInSentence + 1;
            if(this.state.currentWordInSentence === this.props.sentences[this.state.currentSentence].length){
            this.state.questionText = this.state.questionText + ".";
            }
        }
    }
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
            // onPress={() => props.navigation.push("End of Round")}    
          />
          <Text style={styles.titleText}>Score: {points}</Text>
          <Text style={styles.subtitleText}>Question: {currentQuestion +1}</Text>  
          {/* <Button onPress={()=>{
              this.props.switchVisible();
            }} title=" This should work"/> */}
        <ScrollView>
                    
        {showQuestion ? (
      <>
        <View style={styles.questionView}>
              <Text style={{padding: 10, color: 'white'}}>Last Question Answer: {currentQuestion > 0 ? gameQuestions[currentQuestion-1].answerText : ""}</Text>    
        </View>
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
        <View style={{top: 100}}>
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
        }</View>
        </SafeAreaView> 
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
