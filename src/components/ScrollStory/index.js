import React, {useState} from 'react';
import {Animated, Dimensions, StyleSheet} from 'react-native';

import ButtonContainerStory from '../ButtonContainerStory';

const {width} = Dimensions.get('window');

const ScrollStory = ({
  scroll,
  stories,
  handleNext,
  handlePrev,
  setPause,
  x,
  everyStoryIsInactive,
  currentStoryIndex,
  changeActiveStoryTesteStories,
}) => {
  const [scrollDirection, setScrollDirection] = useState({x: 0});
  const qtdStories = stories.length;

  async function handleMovingForward(currentPosition) {
    if (everyStoryIsInactive) {
      setScrollDirection({x: width * (stories.length - 1)});
      await changeActiveStoryTesteStories(qtdStories - 1, true);
    } else {
      setScrollDirection({x: currentPosition});
      await changeActiveStoryTesteStories(currentStoryIndex, false, 'NEXT');
    }
  }

  async function handleMovingBack(currentPosition) {
    if (everyStoryIsInactive) {
      setScrollDirection({x: 0});
      await changeActiveStoryTesteStories(0, true);
    } else {
      setScrollDirection({x: currentPosition});
      await changeActiveStoryTesteStories(currentStoryIndex, false, 'PREV');
    }
  }

  async function handleScroll(prevPosition, currentPosition) {
    const error = Math.floor(Math.abs(prevPosition - currentPosition));
    const changedScrollPosition = error > 1;

    if (changedScrollPosition) {
      const isMovingForward = prevPosition < currentPosition;
      const isMovingBack = prevPosition > currentPosition;

      if (isMovingForward) {
        await handleMovingForward(currentPosition);
      } else if (isMovingBack) {
        await handleMovingBack(currentPosition);
      }
    }
  }

  return (
    <Animated.ScrollView
      ref={scroll}
      style={StyleSheet.absoluteFillObject}
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      snapToInterval={0}
      contentContainerStyle={{width: width * qtdStories}}
      onScroll={Animated.event([{nativeEvent: {contentOffset: {x}}}], {
        listener: async e => {
          setPause(true);
          const currentPosScrol = e.nativeEvent.contentOffset.x;

          const resto = currentPosScrol % e.nativeEvent.layoutMeasurement.width;

          const error =
            resto > 0
              ? Math.floor(
                  Math.abs(resto - e.nativeEvent.layoutMeasurement.width),
                ) === 0
              : resto === 0;

          if (error) {
            setPause(false);
            await handleScroll(scrollDirection.x, currentPosScrol);
          }
        },
        useNativeDriver: true,
      })}
      decelerationRate={'fast'}
      horizontal>
      <ButtonContainerStory
        stories={stories}
        handleNext={handleNext}
        handlePrev={handlePrev}
        setPause={setPause}
      />
    </Animated.ScrollView>
  );
};

export default ScrollStory;
