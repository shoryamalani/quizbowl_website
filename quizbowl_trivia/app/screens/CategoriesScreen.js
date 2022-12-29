import React, {Fragment, useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TextInput, Alert,Image, Switch, Dimensions, Modal, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { incrementSentence, incrementWordInSentence, resetGame, setCurrentQuestionText, setRunQuestion,resetWordInSentence,setIsUpdating, incrementPointsByAmount, setCurrentColor, incrementQuestion, setQuestionUserAnswer, toggleTopic } from '../../features/game/gameSlice';
import { Button} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const CategoriesScreen = (props) => {
    const navigation = useNavigation();

    const topics = useSelector(state => state.game.topics);
    const onToggleSwitch = (id) => dispatch(toggleTopic(String(id)));
    const categoryList = {
        14: "Mythology",
        15: "Literature",
        16: "Trash",
        17: "Science",
        18: "History",
        19: "Religion",
        20: "Geography",
        21: "Fine Arts",
        22: "Social Science",
        25: "Philosophy",
        26: "Current Events (probably outdated)"
    }
    // categoryList = () => {
        
    // }

// BASIC TEMPLATE FOR EACH NEW CATEGORY BOX:
    // <View style={styles.textBox}>    
    //     <Text style={styles.statsScreenText}>Literature</Text>
    //         <Switch
    //             style={{ height: 30, bottom: 27, alignSelf: 'flex-end', right: 20 }}
    //             thumbColor="#ff3bac"
    //             value={isSwitchOn}
    //             onValueChange={onToggleSwitch}
    //             trackColor={{ false: '#3b92ff', true: '#51009c' }}
    //             ios_backgroundColor='#3b92ff'
    //     />
    // </View>



    return (
        <Fragment>
            <LinearGradient
                colors={['#D6FFCF', '#7DFF83']}
                style={{width: width, height: height}}    
            >
            <SafeAreaView>
            <View style={{height: 30}} />    
            <Button
                style={{alignSelf: 'flex-end', width: 30, height: 50, borderRadius: 100}}
                contentStyle={{alignSelf: 'center'}}
                buttonColor="transparent"
                icon={() => (
                    <Image
                        source={require('../assets/xMarkGreen.png')}
                        style={styles.xMark}
                    />
                )}
                onPress={() => {
                console.log('hi');
                props.switchToSettings();
            }} >
            </Button>
            <View style={styles.scoreTextContainer}>
                <Text style={styles.scoreText}>
                    Category List
                </Text>
            </View>
            <ScrollView>
            {
                Object.keys(topics).map((id) => {
                    return (
                        <View style={styles.textBox} key={id}>    
                            <Text style={styles.statsScreenText}>{categoryList[id]}</Text>
                                <Switch
                                    style={{ height: 30, bottom: 27, alignSelf: 'flex-end', right: 20 }}
                                    thumbColor="#ff3bac"
                                    value={topics[id]}
                                    onValueChange={() => onToggleSwitch(id)}
                                    trackColor={{ false: '#3b92ff', true: '#51009c' }}
                                    ios_backgroundColor='#3b92ff'
                            />
                        </View>
                    )
                })
            }
            {/* <View style={styles.textBox}>    
            <Text style={styles.statsScreenText}>Literature</Text>
                <Switch
                    style={{ height: 30, bottom: 27, alignSelf: 'flex-end', right: 20 }}
                    thumbColor="#ff3bac"
                    value={isSwitchOn}
                    onValueChange={onToggleSwitch}
                    trackColor={{ false: '#3b92ff', true: '#51009c' }}
                    ios_backgroundColor='#3b92ff'
                />
            </View> */}
            {/* <View style={styles.textBox}>     */}
            {/* <Text style={styles.statsScreenText}>Literature</Text>
                <Switch
                    style={{ height: 30, bottom: 27, alignSelf: 'flex-end', right: 20 }}
                    thumbColor="#ff3bac"
                    value={isSwitchOn}
                    onValueChange={onToggleSwitch}
                    trackColor={{ false: '#3b92ff', true: '#51009c' }}
                    ios_backgroundColor='#3b92ff'
                />
            </View>             */}
            <View style={{height: 200}} />
            </ScrollView>
            </SafeAreaView>
            </LinearGradient>
        </Fragment>
    );
}

const styles = StyleSheet.create({
    scoreTextContainer: {
        width: width / 1.2,
        backgroundColor: '#ff6100',
        borderRadius: 30,
        top: -10,
        marginBottom: 10,
        resizeMode: 'contain',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20
    },
    scoreText: {
        fontSize: 35,
        color: '#000877',
        padding: 15,
    },
    statsScreenText: {
        padding: 30,
        paddingBottom: 0,
        fontSize: 18,
        color: '#D6FFCF'
    },
    textBox: {
        width: width / 1.1,
        backgroundColor: '#ffa900',
        borderRadius: 30,
        top: 10,
        marginBottom: 10,
        resizeMode: 'contain',
        marginLeft: 15,
        // alignItems: 'center',
    },
    xMark: {
        width: 30,
        height: 30,
        position: 'absolute',
        top: -15,
        left: -15,
    },
});

export default CategoriesScreen;