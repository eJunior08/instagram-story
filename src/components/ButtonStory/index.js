import React from 'react';
import {Dimensions, Pressable} from 'react-native';

const {width} = Dimensions.get('window');

const ButtonStory = ({prevFn, nextFn}) => {
  return (
    <>
      <Pressable
        onPress={() => prevFn()}
        style={{width: width * 0.3}}></Pressable>
      <Pressable
        onPress={() => nextFn()}
        style={{width: width * 0.7}}></Pressable>
    </>
  );
};

export default ButtonStory;
