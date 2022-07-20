import { useState } from 'react';
import { Modal, Button,SafeAreaView,Text, View, StyleSheet, Alert,Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Slider } from '@miblanchard/react-native-slider';

function StartGameOverview(props) {
  function getQuestions(){
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
  return (
    <>
    <StatusBar style="light" />
    <Modal visible={props.visible} animationType="slide">
    
      <SafeAreaView style={styles.inputContainer}>
        <Text>LETS TRY THIS</Text>
        <Button title='Start Game' onPress={getQuestions}/> 
         <Slider></Slider>
      </SafeAreaView>
      
    </Modal>
    </>
  )
};

export default StartGameOverview;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
