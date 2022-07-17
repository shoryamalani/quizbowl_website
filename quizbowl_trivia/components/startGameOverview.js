import { useState } from 'react';
import { Modal, Button, View, StyleSheet, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

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
  return (<Modal visible={props.visible} animationType="slide">
    <StatusBar style="light" />
      <View style={styles.inputContainer}>
        <Button title='Start Game' onPress={getQuestions}/>
      </View>
      
    </Modal>
  )
};

export default StartGameOverview;
const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
