import React, { Fragment } from 'react';
import { StyleSheet, View, Text, Dimensions, SafeAreaView, ScrollView, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

function EndOfRoundScreen(props) {
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
            <ScrollView>
            <View style={styles.questionTextBox}>
                <Text style={styles.endOfRoundText}>
                This is an example question text box = = = ooaspofapsjgpajgp
                </Text>
            </View>
{/* It would be nice if we could get the backgroundColor of the answer text box to be red or green based off if the question was correct or not         */}
            <View style={[styles.answerTextBox, { backgroundColor: 'yellow' }]}>
{/* This should work if it's black either way, I'll make it bold */}
                <Text style={styles.answerText}>
                This is an example answer text box
                </Text>
            </View>
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
        fontSize: 15,
        color: 'black',
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        width: width,
        height: height,
    },
    endOfRoundText: {
        padding: 30,
        fontSize: 15,
        color: '#602f01',
    },
    questionTextBox: {
        width: width / 1.1,
        backgroundColor: '#b96fff',
        borderRadius: 30,
        top: 10,
        marginBottom: 10,
        resizeMode: 'contain',
        marginLeft: 15,  
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