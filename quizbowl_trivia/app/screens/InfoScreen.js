import React, { Fragment } from 'react';
import { SafeAreaView, StyleSheet, Text, Dimensions, View, ScrollView} from 'react-native';
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
                <Text style={styles.infoScreenText}>Welcome to </Text>
            </View>
            <View style={styles.textBox}>
                <Text style={styles.infoScreenText}>To better simulate a quizbowl experience, this app uses an advanced speech system that requires silent mode to be off.</Text>
            </View>
            <View style={styles.textBox}>
                <Text style={styles.infoScreenText}>Each round will have 15 questions of varying difficulty. Your difficulty setting can be set in the game settings screen which appears when you press Start Round.</Text>
            </View>
            <View style={styles.textBox}>
                <Text style={styles.infoScreenText}>The scoring system is speed-based, meaning that if you buzz earlier in the question, you get more points.</Text>
            </View>
            <View style={styles.textBox}>
                <Text style={styles.infoScreenText}>You can pick what voice you want in the settings tab.</Text>
            </View>
            <View style={styles.textBox}>
                <Text style={styles.infoScreenText}>You can pick what voice you want in the settings tab.</Text>
            </View>
            <View style={styles.textBox}>
                <Text style={styles.infoScreenNote}>Note: this app's questions come from the QuizDB database with permission but is not officially affiliated with QuizDB.</Text>
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
        fontSize: 15,
        color: '#281e8d'
    },
    infoScreenNote: {
        padding: 30,
        fontSize: 15,
        color: 'black'
    },
    infoScreenTextContainer: {
        flex: 1
    },
    textBox: {
        width: width / 1.1,
        backgroundColor: '#03ffa9',
        borderRadius: 30,
        top: 10,
        marginBottom: 10,
        resizeMode: 'contain',
        marginLeft: 15
    },
})

export default InfoScreen;