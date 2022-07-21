import { Modal, Pressable, SafeAreaView, Text, View, StyleSheet, Dimensions, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView } from "react-native-gesture-handler";

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

function gameDifficultyInfo(props) {
    return (
        <Modal visible={props.visible} animationType="slide">
            <LinearGradient
                colors={['#D6FFCF', '#7DFF83']}
                style={styles.gradientStyle}
            >
            <SafeAreaView>
            <Pressable onPress={() => { console.log('henlo'); props.switchModals() }} >
                <Image source={require('../assets/xMarkGreen.png')} style={styles.xMark} />       
            </Pressable>
                <ScrollView>
                    <View style={styles.textBox}>
                        <Text style={styles.gameDifficultyInfoText}>Game difficulty is based off what levels certain questions are read to in tournaments. For example, a Level 5 round would consist of questions read in high school tournaments at the national level.
                        </Text>
                    </View>
                    <View style={styles.textBox}>
                        <Text style={styles.gameDifficultyInfoText}>
                        Speaking Rate is simply the speed at which the phone will say the words. 10 is the average speaking speed. For better practice of reflex buzzing, try increasing the speaking speed to train how fast you can buzz.
                        </Text>
                    </View>
                    <View style={styles.easterEgg}>
                    </View>    
                </ScrollView>
                </SafeAreaView>
            </LinearGradient>        
        </Modal>
    );
}
const styles = StyleSheet.create({
    easterEgg: {
        height: height,
        width: width,
        alignItems: 'center'
    },
    gameDifficultyInfoText: {
        padding: 30,
        fontSize: 15,
        color: '#D6FFCF'
    },
    gradientStyle: {
        flex: 1,
        alignItems: 'center'
    },
    textBox: {
        width: width / 1.1,
        backgroundColor: '#593DE3',
        borderRadius: 30,
        top: 10,
        marginBottom: 10,
        resizeMode: 'contain'
    },
    xMark: {
        width: 30,
        height: 30,
        position: 'relative',
        left: width - 75,
        bottom: 0,
        padding: 10
    },
})
export default gameDifficultyInfo;