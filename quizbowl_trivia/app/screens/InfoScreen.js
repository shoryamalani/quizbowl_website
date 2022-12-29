import React, { Fragment } from 'react';
import { SafeAreaView, StyleSheet, Text, Dimensions, View, ScrollView, Pressable, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

function InfoScreen(props) {
    return (
        <Fragment>
        <View style={styles.infoScreenTextContainer}>
            <StatusBar style="dark"/>
            <LinearGradient
                colors={['#E38C58', '#4EBCB7']}
                style={{width: width, height: height}}    
            >
            <SafeAreaView>
            <ScrollView>          
            <View style={styles.textBox}>
                <Text style={styles.infoScreenText}>Welcome to Trivia SLAM, coded by Shorya Malani and Arnav Lahoti. Trivia SLAM is a versatile app designed for quizbowl, but it can be used for fun trivia practice, too.</Text>
            </View>
            <View style={styles.textBox}>
                <Text style={styles.infoScreenText}>To better simulate a quizbowl experience, this app uses an advanced speech system that requires silent mode to be off.</Text>
            </View>
            <View style={styles.textBox}>
                <Text style={styles.infoScreenText}>Each round will have 15 questions of varying difficulty. You can set your difficulty after pressing Start Round.</Text>
            </View>
            <View style={styles.textBox}>
                <Text style={styles.infoScreenText}>The scoring system is speed-based, meaning that if you buzz earlier in the question, you get more points. There is no penalty for guessing wrong, but you can only buzz once. Clues get easier as the question progresses.</Text>
            </View>
            <View style={styles.textBox}>
                <Text style={styles.infoScreenText}>XP is calculated as ten times the amount of points you get from each round. You can see your total XP in the statistics page.</Text>
            </View>                
            {/* <View style={styles.textBox}>
                <Text style={styles.infoScreenText}>You can pick what voice you want the phone to use to narrate questions in the settings tab.</Text>
            </View> */}
            <View style={styles.textBox}>
                <Text style={styles.infoScreenText}>There are Easter Eggs hidden in the app, happy hunting!</Text>
            </View>
            <Pressable onPress={() => Alert.alert('Congratulations', "You found an easter egg!!! Good luck finding the rest! ;) (some of them are actual eggs)")}>                    
            <View style={styles.textBox}>
                <Text style={styles.infoScreenNote}>Note: this app's questions come from the QuizDB database with permission, but this app is not officially affiliated with QuizDB.</Text>
            </View>
            </Pressable>
            <View style={styles.textBox}>
                <Text style={styles.infoScreenText}>To contact the developers, email lahoti500@gmail.com or shoryamal@gmail.com.</Text>
            </View>
            </ScrollView>
            </SafeAreaView>
            </LinearGradient>
        </View>
        </Fragment>
    );
}

const styles = StyleSheet.create({
    infoScreenText: {
        padding: 30,
        fontSize: 18,
        color: '#281e8d'
    },
    infoScreenNote: {
        padding: 30,
        fontSize: 19,
        color: 'black'
    },
    infoScreenTextContainer: {
        flex: 1,
    },
    textBox: {
        width: width / 1.1,
        backgroundColor: '#03ffa9',
        borderRadius: 30,
        top: 10,
        marginBottom: 10,
        resizeMode: 'contain',
        marginLeft: 15,
        // alignItems: 'center',
    },
})

export default InfoScreen;