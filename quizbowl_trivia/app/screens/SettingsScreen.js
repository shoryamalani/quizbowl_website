import React, { Fragment, } from 'react';
import { ImageBackground, StyleSheet, View, Image, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function SettingsScreen(props) {
    return (
        <Fragment>
        <SafeAreaView style={styles.textContainer}>      
            <Pressable onPress={() => props.navigation.navigate("Welcome")} >        
                <View style={{ padding: 10 }}>
                    <Text style={styles.backToWelcomeScreenButton}>Go back from settings screen to the welcome screen</Text>
                </View>
            </Pressable>
        </SafeAreaView>
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