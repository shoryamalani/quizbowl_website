import { Modal, Pressable, SafeAreaView, Text, View, StyleSheet, Dimensions, Image } from "react-native";

import React from 'react';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

function speechSpeed(props) {
    return (
        <Modal visible={props.visible} animationType="slide">
        <SafeAreaView>
            <Pressable onPress={() => { console.log('henlo'); props.switchModals() }} >
                <Image source={require('../assets/xMarkGreen.png')} style={styles.xMark} />       
            </Pressable>
                <Text style={styles.speechSpeedText}>Speaking rate simply refers to the speed of the phone's speech. The average speaking rate is 10.</Text>    
        </SafeAreaView>
        </Modal>
    );
}
const styles = StyleSheet.create({
    speechSpeedText: {
        padding: 30,
        fontSize: 25,
    },
    xMark: {
    width: 30,
    height: 30,
    position: 'relative',
    left: width - 50,
    bottom: 0,
    padding: 10
    },
})
export default speechSpeed;