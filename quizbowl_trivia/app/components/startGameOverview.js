import { useState } from 'react';
import { ScrollView, Modal, View, StyleSheet, Alert, Text, Dimensions, Pressable, Image, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Picker from '@gregfrench/react-native-wheel-picker';
import { Icon, Button, ButtonGroup, withTheme } from '@rneui/themed';
import { useSelector } from 'react-redux';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var PickerItem = Picker.Item;

function StartGameOverview(props) {
  const [selectedItem, setSelectedItem] = useState(2);
    const [itemList, setItemList] = useState(['loading...']);
    const [enabled, setEnabled] = useState(false);
    const toggleSwitch = () => {
        setEnabled(oldValue => !oldValue)
    }
  //sliderData refers to the difficultyCategories/Levels slider
  const [sliderData, setSliderData] = useState(10);
  const [speechSpeed, setSpeechSpeed] = useState(10);
  const navigation = useNavigation();
  const topics = useSelector(state => state.game.topics);
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
      "topics": topics,
      "numOfQuestions": 16,
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
            // console.log(result)
            var properResult = JSON.parse(result);
            // setCurrentQuestions(properResult);
            // console.log(properResult);
            // console.log(result)
            // console.log(currentQuestions);
            for(var i = 0; i < properResult.length; i++) {
              properResult[i].question = properResult[i].question.split(" ");
            }
            // console.log(properResult[0].question)
            props.startGame(properResult,speechSpeed/10);
            // setQuestionText(currentQuestions[0].question.join(" "));
            })
          .catch(error => {
            console.log('error', error)
            // Alert.alert("Error", error);
    });
  }
  return (<Modal visible={props.visible} animationType="slide">
    <StatusBar style="dark" />
    <LinearGradient
      colors={['#D6FFCF', '#7DFF83']}
      style={styles.inputContainer} 
    >
      <Pressable onPress={() => { console.log('hi');props.switchToWelcome() }} >
        <View style={{padding: 30, margin: 5, top: 150}} >
          <Image source={require('../assets/xMarkGreen.png')} style={styles.xMark} />
        </View>
      </Pressable>
    <ScrollView directionalLockEnabled={true} style={{marginTop: 30, alignSelf: 'center'}}>
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
      <View style={{alignItems: 'center', paddingBottom: 20, top: -80}}>
      <Text style={styles.sliderCategoryHeader}>Speaking Rate/WPM</Text>
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
      <Button
        type="clear"
        title="Categories"
        titleStyle={{color: 'white', fontSize: 25}}
        containerStyle={{ top: -40 ,width: width, marginRight: 15, alignItems: 'center', borderRadius: 15, marginBottom: 20}}
        buttonStyle={{borderWidth: 0, backgroundColor: '#593DE3', borderRadius: 15, height:75, width: width/2}}
        raised
        onPress={() => props.switchToCategories()}  
      />
      <Button
        type="clear"
        title="Head-To-Head"
        titleStyle={{color: 'white', fontSize: 25}}
        containerStyle={{ top: -20, width: width, marginRight: 15, alignItems: 'center', borderRadius: 15}}
        buttonStyle={{borderWidth: 0, backgroundColor: '#1500b3', borderRadius: 15, height:75, width: width/1.7}}
        raised
        onPress={() => props.switchToCategories()}  
      />  
    </ScrollView>
      <Button type ="clear" onPress={getQuestions}>
        <View style={[styles.startGameButton, { bottom: 5 }]}>
          <Text style={styles.startGameText}>Start Game</Text>
        </View>
      </Button>
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
  pickerContainer: {
    alignItems: 'center',
    width: width / 1.2,
    height: height / 3,
    backgroundColor: '#DEFFA6',
    borderRadius: 30,
    marginBottom: 20,
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
    paddingTop: 80,
  },
  sliderCategoryText: {
    fontSize: 20,
    marginLeft: 10,
    marginRight: 10,
    color: '#1D2C9D',
    paddingBottom: 0,
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
    backgroundColor: '#162692',
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
