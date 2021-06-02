import React from 'react';
import {Dimensions, Pressable} from 'react-native';

const {width} = Dimensions.get('window');

const ButtonStory = ({prevFn, nextFn, setPause}) => {
  return (
    <>
      <Pressable
        // onLongPress={() => setPause(true)}
        onPress={() => prevFn()}
        // onTouchMove={() => setPause(true)}
        // onPressOut={() => setPause(false)}
        style={{width: width * 0.3}}></Pressable>
      <Pressable
        // onPressIn={() => console.log('pressss iinn')}
        onPress={() => nextFn()}
        // onLongPress={() => setPause(true)}
        // onTouchMove={() => setPause(true)}
        // onPressOut={() => setPause(false)}
        // onTouchEnd={() => nextFn()}
        style={{width: width * 0.7}}></Pressable>
    </>
  );
};

export default ButtonStory;
