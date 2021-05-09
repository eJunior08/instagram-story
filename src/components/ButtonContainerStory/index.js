import React from 'react';
import {Dimensions, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
const {width} = Dimensions.get('window');

import ButtonStory from '../ButtonStory';

import {
  nextImage,
  prevImage,
  updateCurrentStoryIndex,
} from '../../redux/slices/stories.slice';

import styles from './styles';

const ButtonContainerStory = ({stories, scrollRef}) => {
  const dispatch = useDispatch();
  const images = useSelector(state => state.stories.images);
  console.log('images', images);

  return (
    <View style={styles.container}>
      {stories.map((_, index) => (
        <ButtonStory
          key={index}
          prevFn={() => {
            dispatch(prevImage({storyIndex: index}));
            if (images[index].index === 0) {
              if (index > 0)
                dispatch(updateCurrentStoryIndex({index: index - 1}));

              scrollRef?.current?.scrollTo({x: (index - 1) * width});
            }
          }}
          nextFn={() => {
            console.log('next');
            dispatch(nextImage({storyIndex: index}));
            if (images[index].index === images[index].total - 1) {
              if (index < stories.length - 1)
                dispatch(updateCurrentStoryIndex({index: index + 1}));

              scrollRef?.current?.scrollTo({x: (index + 1) * width});
            }
          }}
        />
      ))}
    </View>
  );
};

export default ButtonContainerStory;
