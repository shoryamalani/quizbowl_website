import React, { Fragment } from 'react';
import { SafeAreaView, StyleSheet, Text, Dimensions, View, } from 'react-native';
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
            <Text>To better simulate a quizbowl experience, this app uses an advanced speech system, which requires silent mode to be off.</Text>
            <Text style={styles.infoScreenText}>Note: this app's questions come from the QuizDB database with permission but is not officially affiliated with QuizDB</Text>
            </SafeAreaView>
            </LinearGradient>
        </View>
        </Fragment>
    );
}

const styles = StyleSheet.create({
    infoScreenText: {
        color: 'black',
        fontSize: 20,
        paddingLeft: 10,
        paddingRight: 10,
        bottom: -width-200
    },
    infoScreenTextContainer: {
        flex: 1,
    },
})

export default InfoScreen;