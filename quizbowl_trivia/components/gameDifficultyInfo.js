import React, {Fragment} from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
function GameDifficultyInfo(props) {
    return (
        <Fragment>
            <SafeAreaView style={styles.gameDifficultyInfoContainer}>

            </SafeAreaView>
        </Fragment>
    );
}

const styles = StyleSheet.create({
    gameDifficultyInfoContainer: {
        flex: 1,
    },
})

export default GameDifficultyInfo;