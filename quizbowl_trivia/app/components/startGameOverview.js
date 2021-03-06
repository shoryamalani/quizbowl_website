import { useState } from 'react';
import { Modal, Button, View, StyleSheet, Alert, Text, Dimensions, Pressable, Image, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

function StartGameOverview(props) {
  //sliderData refers to the difficultyCategories/Levels slider
  const [sliderData, setSliderData] = useState(10);
  const [speechSpeed, setSpeechSpeed] = useState(10);
  const navigation = useNavigation();
  const [canClick, setCanClick] = useState(true);
  var difficultyCategories = {
    1: 'Middle School',
    2: 'Easy High School',
    3: 'Regular HS',
    4: 'Hard High School',
    5: 'Nationals HS',
    6: 'Easy College',
    7: 'Regular College',
    8: 'Hard College',
    9: 'Open',
    10: 'Random!',
  };
  // function displayDifficultyInfo() {
  //   difficultyInfoModalIsVisible: false,

  // };
  function getQuestions() {
    if (canClick != true) {
      return;
    }
    setCanClick(false);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    // fetch("https://quizbowl.shoryamalani.com/get_round_questions", requestOptions)
    //   .then(response => response.text())
    //   .then(result => {
        
    //     var properResult = JSON.parse(result);
    //     // setCurrentQuestions(properResult);
    //     console.log(properResult);
    //     // console.log(result)
    //     // console.log(currentQuestions);
    //     props.startGame(properResult);
    //     // setQuestionText(currentQuestions[0].question.join(" "));
    //     })
    //   .catch(error => {
    //     console.log('error', error)
    //     Alert.alert("Error", "Could not get questions");
    // });
    var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "data": {
      "topics": {
        "14": true,
        "15": true,
        "16": true,
        "17": true,
        "18": true,
        "19": true,
        "20": true,
        "21": true,
        "22": true,
        "25": true,
        "26": true,

      },
      "numOfQuestions": 15,
      "difficulty": sliderData == 10 ? 11 : sliderData
    }
  });
  console.log(raw)

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://quizbowl.shoryamalani.com/get_questions_with_diff_topic_and_ques", requestOptions)
    .then(response => response.text())
    .then(result => {
            console.log(result)
            var properResult = JSON.parse(result);
            // setCurrentQuestions(properResult);
            // console.log(properResult);
            // console.log(result)
            // console.log(currentQuestions);
            for(var i = 0; i < properResult.length; i++) {
              properResult[i].question = properResult[i].question.split(" ");
            }
            // console.log(properResult[0].question)
            props.startGame(properResult);
            // setQuestionText(currentQuestions[0].question.join(" "));
            })
          .catch(error => {
            console.log('error', error)
            Alert.alert("Error", "Could not get questions");
    });
  }
  return (<Modal visible={props.visible} animationType="slide">
    <StatusBar style="dark" />
    <LinearGradient
      colors={['#D6FFCF', '#7DFF83']}
      style={styles.inputContainer} 
    >
      <Pressable onPress={() => { console.log('hi');props.switchToWelcome() }} >
          <View style={{padding: 30, margin: 5}} >
            <Image source={require('../assets/xMarkGreen.png')} style={styles.xMark} />
          </View>
        </Pressable>  
      <View style={{alignItems: 'center', paddingBottom: 40, top:-60}}>
      <Text style={styles.sliderCategoryHeader}>Game Difficulty</Text>
      <Slider
        maximumValue={10}
        minimumValue={1}
        step={1}
        value={sliderData}
        onValueChange={(sliderValue) => setSliderData(sliderValue)}
        style={styles.sliderDifficulty}
        minimumTrackTintColor='#0D7EFF'
        maximumTrackTintColor='#A6FFF9'
        thumbTintColor='#4EBCB7'/>
      <View style={styles.difficultyCategoryContainer}>
        <Text style={styles.sliderCategoryText}>Level {sliderData}: {difficultyCategories[sliderData]}
        <Pressable onPress={() => {props.switchToInfoAboutDifficult()}} >
          <Image source={require('../assets/questionMarkCircleBlue.png')} style={styles.questionMarkInCircle} />
        </Pressable>
        </Text>
        </View>
      </View>
      <View style={{alignItems: 'center', paddingBottom: 20, top: -60}}>
      <Text style={styles.sliderCategoryHeader}>Speaking Rate</Text>
      <Slider
        maximumValue={20}
        minimumValue={10}
        step={1}
        value={speechSpeed}
        onValueChange={(speechSpeedValue) => setSpeechSpeed(speechSpeedValue)}
        style={styles.speechSpeed}
        minimumTrackTintColor='#0D7EFF'
        maximumTrackTintColor='#A6FFF9'
        thumbTintColor='#4EBCB7' />
      <Text style={styles.sliderCategoryText}>Speaking rate is {speechSpeed}
        <Pressable onPress={() => {props.switchToInfoAboutDifficult()}} >
          <Image source={require('../assets/questionMarkCircleBlue.png')} style={styles.questionMarkInCircle} />
        </Pressable></Text>
        </View>
      <Pressable onPress={getQuestions}>
        <View style={styles.startGameButton}>
          <Text style={styles.startGameText}>Start Game</Text>
        </View>
      </Pressable>
    </LinearGradient>
    </Modal>
  )
};

export default StartGameOverview;

const styles = StyleSheet.create({
  difficultyCategoryContainer: {
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    height: height,
    flexDirection: 'column',
  },
  questionMarkInCircle: {
    width: 17,
    height: 17,
    top: -8,
    marginRight: 5,
    marginLeft: 5
  },
  sliderCategoryHeader: {
    fontSize: 27,
    marginLeft: 10,
    marginRight: 10,
    color: '#1D2C9D',
  },
  sliderCategoryText: {
    fontSize: 20,
    marginLeft: 10,
    marginRight: 10,
    color: '#1D2C9D',
    paddingBottom: 30,
  },
  sliderDifficulty: {
    width: width / 1.2,
    height: 40,
  },
  speechSpeed: {
    width: width / 1.2,
    height: 40
  },
  startGameButton: {
    width: width/1.5,
    height: height/7,
    backgroundColor: '#593DE3',
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'center',
  },
  startGameText: {
    fontSize: 30,
    padding: 10,
    color: '#D6FFCF',
  },
  xMark: {
    width: 30,
    height: 30,
    position: 'absolute',
    left: width / 2 - 20,
    bottom: height / 5 - 25,
    padding: 10
  },
});
