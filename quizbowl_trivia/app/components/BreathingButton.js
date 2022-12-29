import React from 'react';
import { View, Text, TouchableOpacity, Animated, LayoutAnimation } from 'react-native';
import { Button } from '@rneui/themed';

export default function BreathingButton({ onPress }) {
  const scale = new Animated.Value(1);

  const animate = () => {
    LayoutAnimation.configureNext({
      update: {
        scale: scale.interpolate({
          inputRange: [0, 1],
          outputRange: [1.1, 1],
        }),
      },
    });
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      animate();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Button type="solid" raised style={{backgroundColor: 'black',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 0,
      borderRadius: 15}} buttonStyle={{ backgroundColor: 'transparent' }} containerStyle={{ borderRadius: 15 }}
        // onPress={() => {
        //     Speech.stop();
        //     dispatch(setRunQuestion(false));
        //     setShowAnswerInfo(true);
        //     setShowBuzzer(false);
        //     setAnswerViewVisible(false);
        //     setShowQuestion(false);
        // }}
    >
        {/* <Text style={{padding: 10, color: 'white'}}>Last Question Answer: {currentQuestion > 0 ? gameQuestions[currentQuestion-1].answer : ""}</Text>     */}
    </Button>
    </Animated.View>
  );
}
