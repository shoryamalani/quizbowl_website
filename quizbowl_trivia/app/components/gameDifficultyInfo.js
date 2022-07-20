import { Modal, Pressable, SafeAreaView, Text, View } from "react-native";

import React from 'react';

function gameDifficultyInfo(props) {
    return (
        <Modal visible={props.visible} animationType="slide">
        <SafeAreaView>
            <Pressable onPress={() => { console.log('henlo'); props.switchModals() }} >        
                <Text> Game difficulty is based off what levels certain questions are read to in tournaments. For example, a Level 5 round would consist of questions read in tournaments at the national level for high schoolers. If you find that you are consistently able to answer questions very early in the question, then try to challenge yourself by attempting a round with a higher difficulty! On the other hand, if you are doing a round where you do not know </Text>    
            </Pressable>
        </SafeAreaView>
        </Modal>
    );
}


export default gameDifficultyInfo;