import { Modal, Pressable, SafeAreaView, Text, View, StyleSheet, Dimensions, Image,TextInput,Vibration, Platform, Alert, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React from 'react';
import * as Speech from 'expo-speech';
import { Icon, Button, ButtonGroup, withTheme} from '@rneui/themed';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

class Question extends React.Component {
    possibleColors = {
        'neutral': ['#FFC917', '#21EBE4'],
        'correct': ['#FFC917', '#03f215'],
        'incorrect': ['#FFC917', 'red'],
      }  
    state = {
        showQuestion: true,
        answerViewVisible: false,
        whichVoice:null,
        currentSentence : 0,
        sentenceTick: null,
        runQuestion: true,
        questionSentences: [],
        currentSentence: 0,
        questionText:"",
        colorsToUse: this.possibleColors.neutral,
    }
    componentDidMount(){
        console.log(this.props.sentences)
        this.setState({
            questionText:"",
            currentQuestion: this.props.currentQuestion,
            questionSentences: this.props.sentences,
            currentSentence: this.props.currentQuestion,
            score: this.props.score,
            speechSpeed: this.props.speechSpeed,
            runQuestion: false,
            currentWordInSentence: 0,
            currentSentence : 0,
            showBuzzer: true,
            colorsToUse: this.props.colorsToUse,
            answerText:""
        })

        this.sentenceSpeakerHandler();
        if(Platform.OS === 'android'){
          this.state.sentenceTick = setInterval(this.tickSentence, 450/this.props.speechSpeed);
        }else{
          this.state.sentenceTick = setInterval(this.tickSentence, 300/this.props.speechSpeed);
        }
        console.log(this.props.question.answer)
    }

  changeAnswerText(text){
    this.state.answerText = text;
    console.log(text);
  };
  sentenceSpeakerHandler(){
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
  
    tickSentence(){ // this should add a word to the sentence

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
      completeWordHandler(){
        console.log("completing")
        // console.log(this.state.switchingQuestions)
        // if(this.state.switchingQuestions == true){
        //   console.log("switching questions")
        //   return false;
        // }
        if(this.state.buzzed){return false}
        if(this.state.currentWordInSentence === this.state.currentSentence.length){
            this.state.questionText = this.props.sentences.slice(0,this.props.sentences.length-1).join(".") + ".";
            this.state.currentWordInSentence = 0;
        }else{
            this.state.questionText = this.props.sentences.slice(0,this.state.currentSentence+1).join(".") + ".";
            this.state.currentWordInSentence = 0;
        }
        if(this.state.currentSentence+1 == this.props.sentences.length){
            console.log("finished")
            return false;
            }
        if(this.state.currentSentence < this.props.sentences.length){
          this.state.currentSentence = this.state.currentSentence + 1;
          this.sentenceSpeakerHandler()
        }
      }
      buzz(){
        this.setState({
          showQuestion: false,
          showBuzzer: false,
          runQuestion: false,
          answerViewVisible: true,
          buzzed: true,
        })
        console.log("buzz")
        try{
          Speech.stop();
        }catch (e) {
            console.log(e)
        }
        Vibration.vibrate();
    
      }
      finishQuestion(result){
        if(result[0]){
          var words_bonus= this.state.questionText.split(" ").length < 40 ? (40 - this.state.questionText.split(" ").length) : 0;
          this.state.score = this.state.score + words_bonus + 10;
          this.state.colorsToUse = this.possibleColors["correct"]
        }else{
          this.state.colorsToUse = this.possibleColors["incorrect"]
        }
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
        this.props.finishQuestion({
            colorsToUse:this.state.colorsToUse,
            correctOrNot: result[0],
            correctAnswer:result[1],
            newScore:this.state.score
        })
      }
      submitAnswer(){
        console.log(this.state.answerText);
        this.setState({
          showQuestion: false,
          showBuzzer: false,
          answerViewVisible: false,
        })
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
          "answer": this.state.answerText,
          "serverAnswer": this.props.question.answer,
          "questionId": 12
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
        this.setState({
          showBuzzer: true,
          showQuestion: true,
        })
        if (this.state.useSpeech && Speech.isSpeakingAsync()){
          Speech.stop().then((val) => {
            console.log(val)
            this.finishQuestion([result["correctOrNot"],result["correctAnswer"]])
          })
        }else{
          this.finishQuestion([result["correctOrNot"],result["correctAnswer"]])
        }
      })
      .catch(error => {
        Alert.alert("Error", "Could not submit answer")
        console.log('error', error)});

        
      }
    
    constructor(props) {
        super(props);
        this.sentenceSpeakerHandler = this.sentenceSpeakerHandler.bind(this)
        this.completeWordHandler = this.completeWordHandler.bind(this)
        this.tickSentence = this.tickSentence.bind(this)
        this.submitAnswer = this.submitAnswer.bind(this)
        this.buzz = this.buzz.bind(this);
        this.finishQuestion = this.finishQuestion.bind(this);
        this.changeAnswerText = this.changeAnswerText.bind(this)
    
    };
    componentWillUnmount() {
        // this.state.tickSentence.clearInterval();
        this.setState({
            questionText:"",
            currentQuestion: this.props.currentQuestion,
            questionSentences: this.props.sentences,
            currentSentence: this.props.currentQuestion,
            score: this.props.score,
            speechSpeed: this.props.speechSpeed,
            runQuestion: false,
            currentWordInSentence: 0,
            showBuzzer: true,
            colorsToUse: this.props.colorsToUse,
            answerText:""
        })
        console.log("set")
    }


    render() {
        return (
        <Modal 
        // onDismiss={
        //      async()=>{
        //         while(await Speech.isSpeakingAsync()==true ){
        //     }
        //     this.props.dismiss("Cats")}
        // }
         visible={this.props.visible}
        animationType="none">
        <LinearGradient
        colors={this.state.colorsToUse}
        style={styles.container}>
        
        <View style={styles.overallContainer}>
        <SafeAreaView style={styles.overallContainer}>
          <Button
            title="End Round"
            containerStyle={{ width: 500, top: 0}}
            buttonStyle={{borderWidth: 0, backgroundColor: 'purple', borderRadius: 15 }}        
            icon={{name: 'arrow-right', type: 'font-awesome', size: 15, color: 'white'}}
            iconRight
            raised      
          />
          <Text style={styles.titleText}>Score: {this.state.score}</Text>
          <Text style={styles.subtitleText}>Question: {this.props.currentQuestion +1}</Text>  
          {/* <Button onPress={()=>{
              this.props.switchVisible();
            }} title=" This should work"/> */}
        <ScrollView>
                    
        {this.state.showQuestion ? (
          <>
            <View style={styles.questionView}>
                <Text style={{padding: 10, color: 'white'}}>Last Question Answer: {this.props.lastQuestionAnswer}</Text>    
            </View>
      <View style={[styles.questionView, {marginTop: 20}]}>  
        <Text style={{padding: 10, color: 'white', fontSize: 15}}>
          {this.state.questionText}
        </Text>
      </View>
      </>
      ) : null}
      </ScrollView>
      <View style={[styles.answerView, {top: 0}]}>
        {this.state.showBuzzer ? (
          <Pressable onPress={this.buzz}>
            <View style={[styles.buzzerButton, {marginTop: 10}]}>    
            <Text style={styles.buzzText}>Buzz</Text>
            </View>
          </Pressable>
        ) : null}
        
        {this.state.answerViewVisible &&
        <View style={{top: 100}}>
          <View style={[styles.textInputContainer]}>
            <TextInput onChangeText={this.changeAnswerText} value={this.answerText} placeholder='Write your answer here' placeholderTextColor='#bcbcbc' style={styles.textInput} />
          </View>
          <Pressable onPress={this.submitAnswer}>
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
        );
    };
}
// const styles = StyleSheet.create({
//     speechSpeedText: {
//         padding: 30,
//         fontSize: 25,
//     },
//     xMark: {
//     width: 30,
//     height: 30,
//     position: 'relative',
//     left: width - 50,
//     bottom: 0,
//     padding: 10
//     },
// })
export default Question;

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
  
// import { Modal, Pressable, SafeAreaView, Text, View, StyleSheet, Dimensions, Image,Button,TextInput,Vibration } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import React, { useEffect, useState,useRef } from 'react';
// import * as Speech from 'expo-speech';


// let width = Dimensions.get('window').width;
// let height = Dimensions.get('window').height;

// // class Question extends React.Component {
// const Question = (props) => {

//     const possibleColors = {
//         'neutral': ['#FFC917', '#21EBE4'],
//         'correct': ['#FFC917', '#03f215'],
//         'incorrect': ['#FFC917', 'red'],
//       }  
//     const showQuestion = useRef(true);
//     const [answerViewVisible, setAnswerViewVisible] = useState(false);
//     const [whichVoice, setWhichVoice] = useState(null);
//     const [currentSentence, setCurrentSentence] = useState(0);
//     const [runQuestion, setRunQuestion] = useState(true);
//     const [questionText, setQuestionText] = useState("");
//     const [colorsToUse, setColorsToUse] = useState(possibleColors.neutral);
//     const [currentWordInSentence, setCurrentWordInSentence] = useState(0);
//     console.log("props:"+props.sentences)
//     function sentenceSpeakerHandler(){
//       console.log(props.sentences.length)
//       console.log(currentSentence)
//       if(currentSentence < props.sentences.length){
//           console.log(String(props.sentences[currentSentence]))
//         Speech.speak(String(props.sentences[currentSentence]),{
//           language: 'en-US',
//           pitch: 1,
//           rate: props.speechSpeed,
//           // voice: this.state.whichVoice,
//           onStart: () => {
//             setRunQuestion(true);
//             console.log("Starting to speek")
            
//           },onStopped:() =>{
//             console.log("stopped")
  
//           }
//           ,
//           onDone: () => {
//             setRunQuestion(false);
            
//             completeWordHandler();
//             return true;
//           },
//           onError: (error) => {
//               console.log(error)
//               }
  
//         });
//       }
//     }
//       useEffect(() => {
//         console.log("questionSentences:"+props.sentences + " currentSentence.current")
//         if (props.sentences){
//           sentenceSpeakerHandler();
//           setInterval(()=>{tickSentence()}, 300/props.speechSpeed)
//         }

//       },[])
//     // },[])
//     // }
//     const tickSentence = ()=>{ // this should add a word to the sentence
//       console.log(currentWordInSentence)
//       console.log(props.sentences)
//       if (runQuestion !== true){
//         return false;
//       }
//       if(props.sentences.length === 0){
//         return false;
//       }

//       if(runQuestion && currentWordInSentence < props.sentences[currentSentence].split(" ").length){
//         // questionText.current = questionText.current + " " + props.sentences[currentSentence].split(" ")[currentWordInSentence];
//         setQuestionText(questionText + " " + props.sentences[currentSentence].split(" ")[currentWordInSentence]);
//         setCurrentWordInSentence(currentWordInSentence + 1);
//         if(currentWordInSentence === props.sentences[currentSentence].length){
//           // questionText.current = questionText.current + ".";
//           setQuestionText(questionText + ".");
//         }
//       }
//     }
//       function changeAnswerText(text){
//         props.setAnswerText(text);
//         console.log(text);
//       };
  
  
  
//       function completeWordHandler(){
//         console.log("completing")
//         if(props.buzzed){return false}
//         if(currentWordInSentence === currentSentence.length){
//           setCurrentWordInSentence(0);
//         }else{
//             // questionText.current = props.sentences.slice(0,currentSentence+1).join(".") + ".";
//             setQuestionText(props.sentences.slice(0,currentSentence+1).join(".") + ".");
//             setCurrentWordInSentence(0);
//         }
//         if(currentSentence+1 == props.sentences.length){
//             console.log("finished")
//             return false;
//             }
//         if(currentSentence < props.sentences.length){
//           currentSentence = currentSentence + 1;
//           sentenceSpeakerHandler()
//         }
//       }
//       function buzz(){
//         showQuestion.current = false;
//         setShowBuzzer(false);
//         setRunQuestion(false);
//         setAnswerViewVisible(true);
//         setBuzzed(true);

//         console.log("buzz")
//         try{
//           Speech.stop();
//         }catch (e) {
//             console.log(e)
//         }
//         Vibration.vibrate();
    
//       }
//       function finishQuestion(result){
//         if(result[0]){
//           var words_bonus= questionText.split(" ").length < 40 ? (40 - questionText.split(" ").length) : 0;
//           score = score + words_bonus + 10;
//           colorsToUse = possibleColors["correct"]
//         }else{
//           colorsToUse = possibleColors["incorrect"]
//         }
//         props.finishQuestion({
//             colorsToUse:colorsToUse,
//             correctOrNot: result[0],
//             correctAnswer:result[1],
//             newScore:score
//         })
//       }
//       function submitAnswer(){
//         console.log(answerText);
//         showQuestion.current = false;
//         setShowBuzzer(false);
//         setAnswerViewVisible(false);
//         var myHeaders = new Headers();
//         myHeaders.append("Content-Type", "application/json");
//         var raw = JSON.stringify({
//           "answer": answerText,
//           "serverAnswer": question.answer,
//           "questionId": 12
//         });
//         console.log(raw)
//       var requestOptions = {
//         method: 'POST',
//         headers: myHeaders,
//         body: raw,
//         redirect: 'follow'
//       };
    
//       fetch("https://quizbowl.shoryamalani.com/check_answer", requestOptions)
//       .then(response => response.text())
//       .then(result => {
//         console.log(result);
//         var result = JSON.parse(result)
//         setShowBuzzer(true);
//         showQuestion.current = true;

//         if (useSpeech && Speech.isSpeakingAsync()){
//           Speech.stop().then((val) => {
//             console.log(val)
//             finishQuestion([result["correctOrNot"],result["correctAnswer"]])
//           })
//         }else{
//           finishQuestion([result["correctOrNot"],result["correctAnswer"]])
//         }
//       })
//       .catch(error => console.log('error', error));
        
//       }
//         return (
//         <Modal 
//          visible={props.visible}
//         animationType="none">
//         <LinearGradient
//         colors={colorsToUse}
//         style={styles.container}>

//         {/* <View style={styles.overallContainer}> */}
//         <SafeAreaView style={styles.overallContainer}>
//           <Text style={styles.titleText}>Score:{props.score}</Text>
//           <Text style={styles.subtitleText}>Question: {props.currentQuestion +1}</Text>
//         {/* {showQuestion ? (
//             <>
//             <View style={styles.questionView}>
//                 <Text style={{padding: 10, color: 'white'}}>Last Question Answer: {props.lastQuestionAnswer}</Text>    
//             </View>
//       <View style={[styles.questionView, {top: width/4}]}>  
//         <Text style={{padding: 10, color: 'white'}}>
//           {questionText}
//         </Text>
//       </View>
//       </>
//       ) : null} */}
//       {/* <View style={[styles.answerView, {top: width/2}]}>
//         {props.showBuzzer ? (
//             <Pressable onPress={()=>buzz}>
//             <View style={styles.buzzerButton}>    
//             <Text style={styles.buzzText}>Buzz</Text>
//             </View>
//           </Pressable>
//         ) : null} */}
//         {/* {answerViewVisible &&
//         <View>
//           <View style={styles.textInputContainer}>
//             <TextInput onChangeText={()=>changeAnswerText} value={answerText} placeholder='Write your answer here' placeholderTextColor='#bcbcbc' style={styles.textInput} />
//           </View>
//           <Pressable onPress={()=>submitAnswer}>
//             <View style={styles.submitAnswerContainer}>     
//             <View style={styles.submitButton}>    
//               <Text style={styles.submitText}>Submit</Text>
//             </View>
//             </View>
//           </Pressable>      
//         </View>
//         } */}
//         {/* </View> */}
//         </SafeAreaView> 
//         {/* </View>    */}
//         </LinearGradient>
//         </Modal>
//         );
//     };
// const styles = StyleSheet.create({
//     buzzerButton: {
//       height: 40,
//       width: width / 3,
//       backgroundColor: 'yellow',
//       borderRadius: 15,
//       alignItems: 'center',
//       justifyContent: 'center',
//       bottom: 0,
//     },
//     buzzText: {
//       fontSize: 20,
//       color: 'blue',
//     },
//     container: {
//       flex: 1,
//       backgroundColor: 'orange',
//       alignItems: 'center',
//       justifyContent: 'center',
//       padding: 50,
//       flexDirection: 'column'
//     },
//     subtitleText: {
//       fontSize: 28,
//       color: 'white',
//       fontWeight: 'bold',
//       textAlign: 'center',
//       paddingTop: 5,
//       paddingBottom: 10,
//     },  
//     textInput: {
//       padding: 20,
//       fontSize: 30,
//       color: 'white'
//     },
//     textInputContainer: {
//       resizeMode: 'contain',
//       backgroundColor: 'black',
//       borderRadius: 15,
//       bottom: 100
//     },
//     titleText: {
//       fontSize: 32,
//       color: 'white',
//       fontWeight: 'bold',
//       textAlign: 'center',
//       paddingTop: 10,
//     },
//     titleTextContainer: {
//       position: 'absolute',
//       top: 10
//     },
//     overallContainer: {
//       flex:1,
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     questionView: {
//       backgroundColor: 'black',
//       alignItems: 'center',
//       justifyContent: 'center',
//       margin: 5,
//       borderRadius: 15,
//     }, 
//     submitAnswerContainer: {
//       alignItems: 'center',
//     },
//     submitButton: {
//       resizeMode: 'contain',
//       width: width / 2.4,
//       backgroundColor: '#ef6ef7',
//       borderRadius: 15,
//       alignItems: 'center',
//       justifyContent: 'center',
//       bottom: 50,
//     },
//     submitText: {
//       fontSize: 40,
//       color: '#3d02d4',
//       padding: 10,
//     },
//     answerView:{
//       flex:1,
//     }
//   });
// export default Question;