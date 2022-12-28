import React, {Fragment, useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TextInput, Alert,Image, Switch, Dimensions, Modal, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { incrementSentence, incrementWordInSentence, resetGame, setCurrentQuestionText, setRunQuestion,resetWordInSentence,setIsUpdating, incrementPointsByAmount, setCurrentColor, incrementQuestion, setQuestionUserAnswer } from '../../features/game/gameSlice';
import { Button} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const CategoriesScreen = (props) => {
    const navigation = useNavigation();
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
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
            {/* <ScrollView> */}
            <View style={styles.textBox}>    
            <Text style={styles.statsScreenText}>Category List</Text>
                <Switch
                    style={{ height: 30, bottom: 55, alignSelf: 'flex-end', right: 20 }}
                    thumbColor="purple"
                    value={isSwitchOn}
                    onValueChange={onToggleSwitch}
                    trackColor={{ false: 'red', true: 'blue' }}
                    ios_backgroundColor='red'
                />
            </View>
            {/* </ScrollView> */}
            </SafeAreaView>
            </LinearGradient>
        </Fragment>
    );
}

const styles = StyleSheet.create({
    statsScreenText: {
        padding: 30,
        fontSize: 18,
        color: '#D6FFCF'
    },
    textBox: {
        width: width / 1.1,
        backgroundColor: '#593DE3',
        borderRadius: 30,
        top: 10,
        marginBottom: 15,
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