import React from 'react';
import {View} from 'react-native';

import ButtonStory from '../ButtonStory';

import styles from './styles';

const ButtonContainerStory = ({stories, handleNext, handlePrev, setPause}) => {
  return (
    <View style={styles.container}>
      {stories.map((_, index) => (
        <ButtonStory
          setPause={setPause}
          key={index}
          prevFn={() => {
            handlePrev(index);
          }}
          nextFn={() => {
            handleNext(index);
          }}
        />
      ))}
    </View>
  );
};

export default ButtonContainerStory;
