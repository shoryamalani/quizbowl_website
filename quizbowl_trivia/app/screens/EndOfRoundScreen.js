import React, { Fragment } from 'react';
import { StyleSheet, View, Text, Dimensions, SafeAreaView, ScrollView, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { render } from 'react-dom';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

function EndOfRoundScreen(props) {
    console.log(props.route.params.currentQuestions)
    finalList = () =>{
        return props.route.params.currentQuestions.map((question)=>{
            return(
                <>
            <View style={styles.questionTextBox}>
                <Text style={styles.questionText}>
                {question.question.join(" ")}
                </Text>
            </View>
            <View style={[styles.answerTextBox, { backgroundColor: question.result ? '#00EB3F' : '#FF2A00' }]}>
                <Text style={styles.answerText}>
                {question.serverAnswer}
                </Text>
            </View>
            </>
        )})
    } 
    console.log(finalList())
    return (
            <LinearGradient
                colors={['#ffdb6d', '#ce7e00']}
                style={styles.container}    
            >   
            <SafeAreaView>
            <View style={styles.xMarkContainer}>        
            <Pressable onPress={() => props.navigation.navigate("Welcome")} >
                <Image source={require('../assets/xMarkOrange.png')} style={styles.xMark} />       
            </Pressable>
            </View>
            <View style={styles.scoreTextContainer}>
                <Text style={styles.scoreText}>
                    Final Score: {props.route.params.score}
                </Text> 
            </View>
                
            <ScrollView>
            
            {finalList()}
            {/* </View> */}
            </ScrollView>
            </SafeAreaView>
            </LinearGradient>
    );
}

const styles = StyleSheet.create({
    answerTextBox: {
        width: width / 1.1,
        borderRadius: 30,
        top: 10,
        marginBottom: 10,
        resizeMode: 'contain',
        marginLeft: 15,
    },
    answerText: {
        padding: 30,
        fontSize: 19,
        color: 'black',
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        width: width,
        height: height,
    },
    questionText: {
        padding: 30,
        fontSize: 17,
        color: 'black',
    },
    questionTextBox: {
        width: width / 1.1,
        backgroundColor: '#00AAFF',
        borderRadius: 30,
        top: 10,
        marginBottom: 10,
        resizeMode: 'contain',
        marginLeft: 15,  
    },
    scoreTextContainer: {
        width: width / 1.2,
        backgroundColor: '#FF6F00',
        borderRadius: 30,
        top: 10,
        marginBottom: 10,
        resizeMode: 'contain',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20
    },
    scoreText: {
        fontSize: 35,
        color: 'black',
        padding: 15,
        fontWeight: 'bold'
    },
    xMark: {
        width: 30,
        height: 30,
        position: 'relative',
        padding: 15
    },
    xMarkContainer: {
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        height: 40,
        paddingBottom: 10,
        right: 30,
    },
})

export default EndOfRoundScreen;