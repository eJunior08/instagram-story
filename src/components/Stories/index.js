import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, View, Dimensions} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ButtonContainerStory from '../ButtonContainerStory';
import Story from '../Story';

import {
  create,
  updateCurrentStoryIndex,
} from '../../redux/slices/stories.slice';

const {width} = Dimensions.get('window');
const perspective = width;
const angle = Math.atan(perspective / (width / 2));
const ratio = Platform.OS === 'ios' ? 2 : 1.15;

import styles from './styles';

const Stories = ({stories = []}) => {
  const [x, setX] = useState(new Animated.Value(0));
  const scroll = useRef(null);
  const [indexPhoto, setIndexPhoto] = useState(0);
  const [currentIndexStory, setCurrentIndexStory] = useState(0);

  const dispatch = useDispatch();

  const getStyle = index => {
    const offset = width * index;
    const inputRange = [offset - width, offset + width];

    const translateX = x.interpolate({
      inputRange,
      outputRange: [width / ratio, -width / ratio],
      extrapolate: 'clamp',
    });
    const rotateY = x.interpolate({
      inputRange,
      outputRange: [`${angle}rad`, `-${angle}rad`],
      extrapolate: 'clamp',
    });

    const translateX1 = x.interpolate({
      inputRange,
      outputRange: [width / 2, -width / 2],
      extrapolate: 'clamp',
    });

    const extra = width / ratio / Math.cos(angle / 2) - width / ratio;
    const translateX2 = x.interpolate({
      inputRange,
      outputRange: [-extra, extra],
      extrapolate: 'clamp',
    });

    return {
      ...StyleSheet.absoluteFillObject,
      transform: [
        {perspective},
        {translateX},
        {rotateY},
        {translateX: translateX1},
        {translateX: translateX2},
      ],
    };
  };

  dispatch(create({totalStories: stories.length, stories}));

  return (
    <View style={styles.container}>
      {stories.map((story, index) => (
        <Animated.View style={[getStyle(index)]} key={story.id}>
          <Story
            {...{story}}
            indexPhoto={indexPhoto}
            canChange={index === currentIndexStory}
            selfIndex={index}
            scrollRef={scroll}
          />
        </Animated.View>
      ))}

      <Animated.ScrollView
        ref={scroll}
        style={StyleSheet.absoluteFillObject}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToInterval={0}
        contentContainerStyle={{width: width * stories.length}}
        onScroll={Animated.event([{nativeEvent: {contentOffset: {x}}}], {
          listener: e => {
            const currentPosScrol = parseInt(e.nativeEvent.contentOffset.x);
            if (currentPosScrol % parseInt(width) === 0) {
              setIndexPhoto(0);
            }
          },
          useNativeDriver: true,
        })}
        decelerationRate={'fast'}
        horizontal>
        <ButtonContainerStory stories={stories} scrollRef={scroll} />
      </Animated.ScrollView>
    </View>
  );
};

export default Stories;
