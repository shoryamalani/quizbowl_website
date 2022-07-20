import { Modal, Pressable, SafeAreaView, Text, View } from "react-native";

import React from 'react';

function gameDifficultyInfo(props) {
    return (
        <Modal visible={props.visible} animationType="slide">
        <SafeAreaView>
            <Pressable onPress={() => { console.log('henlo'); props.switchModals() }} >        
                <Text> Henlo! </Text>    
            </Pressable>
        </SafeAreaView>
        </Modal>
    );
}


export default gameDifficultyInfo;