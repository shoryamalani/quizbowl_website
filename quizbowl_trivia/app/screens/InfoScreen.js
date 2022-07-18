import React, { Fragment } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

function InfoScreen(props) {
    return (
        <Fragment>
        <SafeAreaView style={styles.infoScreenText}>  
            <Text style={{color: 'purple', fontSize: 50}}>This app was coded by Arnav Lahoti. Shorya kinda helped, but Arnav did all the hard parts lets be real here cmon bois im the best :DDDD</Text>
        </SafeAreaView>
        </Fragment>
    );
}

const styles = StyleSheet.create({
    infoScreenText: {
        flex: 1,

    },
})

export default InfoScreen;