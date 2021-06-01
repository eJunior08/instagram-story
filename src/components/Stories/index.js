import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, View, Dimensions} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ButtonContainerStory from '../ButtonContainerStory';
import Story from '../Story';

import {
  create,
  updateCurrentStoryIndex,
  initStories,
  changeActiveStory,
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

  const qtdStories = stories.length;
  const arrQtdImages = stories.map(story => story.photos.length);

  const state = useSelector(state => state.stories.stories);
  // console.log('state', state);

  const activeStory = state.find(s => s.isActive);
  console.log('activeStory ====> ', activeStory);

  const [scrollDirection, setScrollDirection] = useState({
    direction: 'FRENTE',
    x: 0,
  });

  const currentStoryIndex = useSelector(
    state => state.stories.stories,
  ).findIndex(s => s.isActive);

  console.log('currentStoryIndex', currentStoryIndex);

  const everyStoryIsInactive = useSelector(
    state => state.stories.stories,
  ).every(s => !s.isActive);

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

  useEffect(() => {
    dispatch(initStories({qtdStories, arrQtdImages}));
  }, []);

  dispatch(create({totalStories: stories.length, stories}));

  return (
    <View style={styles.container}>
      {stories.map((story, index) => (
        <Animated.View style={[getStyle(index)]} key={story.id}>
          <Story
            {...{story}}
            selfIndex={index}
            index={state[index]?.currentIndexImage ?? 0}
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
          listener: async e => {
            const currentPosScrol = e.nativeEvent.contentOffset.x;

            const resto =
              currentPosScrol % e.nativeEvent.layoutMeasurement.width;

            const error =
              resto > 0
                ? Math.floor(
                    Math.abs(resto - e.nativeEvent.layoutMeasurement.width),
                  ) === 0
                : resto === 0;

            // console.log('error', error);

            if (error) {
              console.log('scrollDirection x ==========> ', scrollDirection.x);
              console.log('currentPosScrol   ==========> ', currentPosScrol);
              if (scrollDirection.x < currentPosScrol) {
                console.log('PRA FRENTEEEE ====>');

                if (everyStoryIsInactive) {
                  console.log('TODOS FALSE');
                  setScrollDirection({
                    x: width * (stories.length - 1),
                    direction: 'FRENTE',
                  });
                  dispatch(
                    changeActiveStory({
                      index: state.length - 1,
                      isActive: true,
                    }),
                  );
                } else {
                  setScrollDirection({x: currentPosScrol, direction: 'FRENTE'});
                  await dispatch(
                    changeActiveStory({
                      index: currentStoryIndex,
                      isActive: false,
                    }),
                  );
                  await dispatch(
                    changeActiveStory({
                      index: currentStoryIndex + 1,
                      isActive: true,
                    }),
                  );
                }
              } else if (scrollDirection.x > currentPosScrol) {
                if (everyStoryIsInactive) {
                  console.log('TODOS FALSE');
                  setScrollDirection({x: 0, direction: 'TRAS'});
                  dispatch(
                    changeActiveStory({
                      index: 0,
                      isActive: true,
                    }),
                  );
                } else {
                  setScrollDirection({x: currentPosScrol, direction: 'TRAS'});
                  dispatch(
                    changeActiveStory({
                      index: currentStoryIndex,
                      isActive: false,
                    }),
                  );
                  dispatch(
                    changeActiveStory({
                      index: currentStoryIndex - 1,
                      isActive: true,
                    }),
                  );
                }
              }
              setIndexPhoto(0);
            }
          },
          useNativeDriver: true,
        })}
        decelerationRate={'fast'}
        horizontal>
        <ButtonContainerStory
          stories={stories}
          scrollRef={scroll}
          currentStoryIndex={currentStoryIndex}
          isLastImage={
            activeStory?.currentIndexImage === (activeStory?.qtdImages ?? 0) - 1
          }
          isFirstImage={activeStory?.currentIndexImage === 0}
          isLastStory={currentStoryIndex === state.length - 1}
          isFirstStory={currentStoryIndex === 0}
        />
      </Animated.ScrollView>
    </View>
  );
};

export default Stories;
