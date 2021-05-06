import React from 'react';
import {Dimensions, Pressable} from 'react-native';

const {width} = Dimensions.get('window');

const ButtonStory = ({prevFn, nextFn}) => {
  return (
    <>
      <Pressable
        onTouchEnd={() => prevFn()}
        style={{width: width * 0.3}}></Pressable>
      <Pressable
        onTouchEnd={() => nextFn()}
        style={{width: width * 0.7}}></Pressable>
    </>
  );
};

export default ButtonStory;
