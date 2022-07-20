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
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch("https://quizbowl.shoryamalani.com/get_round_questions", requestOptions)
      .then(response => response.text())
      .then(result => {
        
        var properResult = JSON.parse(result);
        // setCurrentQuestions(properResult);
        console.log(properResult);
        // console.log(result)
        // console.log(currentQuestions);
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
      <Pressable onPress={getQuestions}>
        <Text style={styles.startGameText}>Start Game</Text>
      </Pressable>
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
        <Text style={{ fontSize: 27, marginLeft: 10, marginRight: 10, color: '#1D2C9D'}}>Level {sliderData}: {difficultyCategories[sliderData]}
        <Pressable onPress={() => {props.switchToInfoAboutDifficult()}} >
          <Image source={require('../assets/questionMarkCircleBlue.png')} style={styles.questionMarkInCircle} />
        </Pressable>
        </Text>
      </View>
      <Slider
        maximumValue={10}
        minimumValue={1}
        step={.5}
        value={speechSpeed}
        onValueChange={(speechSpeedValue) => setSpeechSpeed(speechSpeedValue)}
        style={styles.speechSpeed}
        minimumTrackTintColor='#0D7EFF'
        maximumTrackTintColor='#A6FFF9'
        thumbTintColor='#4EBCB7' />
    </LinearGradient>
    </Modal>
  )
};

export default StartGameOverview;

const styles = StyleSheet.create({
  difficultyCategoryContainer: {
    alignItems: 'center'
  },
  inputContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    height: height
  },
  questionMarkInCircle: {
    width: 17,
    height: 17,
    top: -16,
    marginRight: 5,
    marginLeft: 5
  },
  sliderDifficulty: {
    width: width / 1.2,
    height: 40,
  },
  speechSpeed: {
    width: width / 1.2,
    height: 40
  },
  startGameText: {
    fontSize: 30,
    padding: 10,
    color: '#593DE3',
  },
  xMark: {
    width: 30,
    height: 30,
    position: 'absolute',
    left: width / 2 - 20,
    bottom: height / 2 - 150,
  },
});
