import React from 'react';
import {Dimensions, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
const {width} = Dimensions.get('window');

import ButtonStory from '../ButtonStory';

import {
  next,
  nextImage,
  prev,
  prevImage,
  updateCurrentStoryIndex,
} from '../../redux/slices/stories.slice';

import styles from './styles';

const ButtonContainerStory = ({stories, scrollRef}) => {
  const dispatch = useDispatch();
  // const images = useSelector(state => state.stories.images);

  return (
    <View style={styles.container}>
      {stories.map((_, index) => (
        <ButtonStory
          key={index}
          prevFn={() => {
            dispatch(prev());
          }}
          nextFn={() => {
            dispatch(next());
          }}
        />
      ))}
    </View>
  );
};

export default ButtonContainerStory;
