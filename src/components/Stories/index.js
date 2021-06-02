import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, View, Dimensions} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ButtonContainerStory from '../ButtonContainerStory';
import Story from '../Story';

import {
  changeActiveStory,
  create,
  initStories,
  next,
  prev,
  resetStories,
} from '../../redux/slices/stories.slice';

const {width} = Dimensions.get('window');
const perspective = width;
const angle = Math.atan(perspective / (width / 2));
const ratio = Platform.OS === 'ios' ? 2 : 1.15;

import styles from './styles';
import {useInterval} from '../../hooks/useInterval';

const Stories = ({stories = []}) => {
  const [x, setX] = useState(new Animated.Value(0));
  const scroll = useRef(null);

  const qtdStories = stories.length;
  const arrQtdImages = stories.map(story => story.photos.length);

  const state = useSelector(state => state.stories.stories);

  const activeStory = state.find(s => s.isActive);

  const [scrollDirection, setScrollDirection] = useState({
    x: 0,
  });

  const currentStoryIndex = useSelector(
    state => state.stories.stories,
  ).findIndex(s => s.isActive);

  const everyStoryIsInactive = useSelector(
    state => state.stories.stories,
  ).every(s => !s.isActive);

  const dispatch = useDispatch();

  const duration = 5000;
  const [pause, setPause] = useState(false);
  const [difference, setDifference] = useState(5000);

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

  useInterval(
    () => {
      handleNext(currentStoryIndex);
    },
    pause ? null : duration,
  );

  async function handlePrev(index) {
    setPause(true);
    const isFirstImage = activeStory?.currentIndexImage === 0;
    const isFirstStory = currentStoryIndex === 0;

    if (isFirstImage) {
      if (isFirstStory) {
      } else {
        await dispatch(prev({storyindex: index}));
        scroll?.current?.scrollTo({x: (index - 1) * width});
      }
    } else {
      await dispatch(prev({storyindex: index}));
    }
    setPause(false);
  }

  async function handleNext(index) {
    setPause(true);
    const isLastImage =
      activeStory?.currentIndexImage === (activeStory?.qtdImages ?? 0) - 1;

    const isLastStory = currentStoryIndex === state.length - 1;

    if (isLastImage) {
      if (isLastStory) {
        await dispatch(next({storyindex: index}));
        await dispatch(resetStories());
        scroll?.current?.scrollTo({x: 0});
      } else {
        await dispatch(next({storyindex: index}));
        scroll?.current?.scrollTo({x: (index + 1) * width});
      }
    } else {
      await dispatch(next({storyindex: index}));
    }
    setPause(false);
  }

  function handleScroll() {}

  return (
    <View style={styles.container}>
      {stories.map((story, index) => (
        <Animated.View style={[getStyle(index)]} key={story.id}>
          <Story
            {...{story}}
            selfIndex={index}
            index={state[index]?.currentIndexImage ?? 0}
            handleNext={handleNext}
            pause={pause}
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
            setPause(true);
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
              setPause(false);
              /* console.log('scrollDirection x ==========> ', scrollDirection.x);
              console.log('currentPosScrol   ==========> ', currentPosScrol); */

              const errorX = Math.floor(
                Math.abs(scrollDirection.x - currentPosScrol),
              );
              if (errorX > 1) {
                if (scrollDirection.x < currentPosScrol) {
                  // console.log('PRA FRENTEEEE ====>');

                  if (everyStoryIsInactive) {
                    /* console.log('TODOS FALSE'); */
                    setScrollDirection({
                      x: width * (stories.length - 1),
                    });
                    await dispatch(
                      changeActiveStory({
                        index: state.length - 1,
                        isActive: true,
                      }),
                    );
                  } else {
                    setScrollDirection({
                      x: currentPosScrol,
                    });
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
                    /* console.log('TODOS FALSE'); */
                    setScrollDirection({x: 0});
                    await dispatch(
                      changeActiveStory({
                        index: 0,
                        isActive: true,
                      }),
                    );
                  } else {
                    setScrollDirection({x: currentPosScrol});
                    await dispatch(
                      changeActiveStory({
                        index: currentStoryIndex,
                        isActive: false,
                      }),
                    );
                    await dispatch(
                      changeActiveStory({
                        index: currentStoryIndex - 1,
                        isActive: true,
                      }),
                    );
                  }
                }
              }
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
          // resetInterval={resetInterval}
        />
      </Animated.ScrollView>
    </View>
  );
};

export default Stories;
