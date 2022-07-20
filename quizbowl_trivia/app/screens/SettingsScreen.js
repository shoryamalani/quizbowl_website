import React, { Fragment, } from 'react';
import { ImageBackground, StyleSheet, View, Image, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

function SettingsScreen(props) {
    return (
        <Fragment>
        <LinearGradient
            colors={['#A6FFF9','#E38C58']}  
            style={styles.textContainer}>      
            <Pressable onPress={() => props.navigation.goBack()} >        
                <View style={{ padding: 10 }}>
                    <Text style={styles.backToWelcomeScreenButton}>Go back from settings screen to the welcome screen</Text>
                </View>
            </Pressable>
        </LinearGradient>
        </Fragment>
    );
}
const styles = StyleSheet.create({
    backToWelcomeScreenButton: {
        textAlign: 'center',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
})
export default SettingsScreen;