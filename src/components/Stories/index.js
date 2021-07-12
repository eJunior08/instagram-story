import React, {useRef, useState} from 'react';
import {Animated, StyleSheet, View, Dimensions} from 'react-native';

/* Components */
import Story from '../Story';
import ScrollStory from '../ScrollStory';

/* Hooks */
import {useInterval} from '../../hooks/useInterval';

/* Styles */
import styles from './styles';

const {width} = Dimensions.get('window');
const perspective = width;
const angle = Math.atan(perspective / (width / 2));
const ratio = Platform.OS === 'ios' ? 2 : 1.15;

const Stories = ({stories = [], children}) => {
  const qtdStories = stories.length;
  const arrQtdImages = stories.map(story => story.photos.length);
  const [testeStories, setTesteStories] = useState(startTesteStories());

  const [x, setX] = useState(new Animated.Value(0));
  const scroll = useRef(null);

  const activeStory = testeStories.find(s => s.isActive);
  const currentStoryIndex = testeStories.findIndex(s => s.isActive);
  const everyStoryIsInactive = testeStories.every(s => !s.isActive);

  const duration = 5000;
  const [pause, setPause] = useState(false);

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

  useInterval(() => handleNext(currentStoryIndex), pause ? null : duration);

  function startTesteStories() {
    const arr = [...Array(qtdStories)].map((arr, index) => ({
      currentIndexImage: 0,
      qtdImages: arrQtdImages[index],
      isActive: false,
    }));

    arr[0].isActive = true;

    return arr;
  }

  async function nextTesteStories(storyindex) {
    if (!isNaN(storyindex)) {
      const {currentIndexImage, qtdImages} = testeStories[storyindex];

      const isLastImage = !(currentIndexImage < qtdImages - 1);

      if (!isLastImage) {
        const arr = testeStories.map((t, index) =>
          index === storyindex
            ? {
                currentIndexImage: t.currentIndexImage + 1,
                qtdImages: t.qtdImages,
                isActive: t.isActive,
              }
            : t,
        );
        await setTesteStories(arr);
      }
    }
  }

  async function changeActiveStoryTesteStories(storyindex, isActive, change) {
    const arr = testeStories.map((t, index) =>
      index === storyindex
        ? {
            currentIndexImage: t.currentIndexImage,
            qtdImages: t.qtdImages,
            isActive: isActive,
          }
        : t,
    );

    if (change === 'NEXT') {
      arr[storyindex + 1].isActive = true;
    } else if (change === 'PREV') {
      arr[storyindex - 1].isActive = true;
    }

    // console.log('arr', arr);
    await setTesteStories(arr);
  }

  function resetStoriesTesteStories() {
    const arr = testeStories.map(t => ({
      currentIndexImage: 0,
      qtdImages: t.qtdImages,
      isActive: false,
    }));

    setTesteStories(arr);
  }

  async function prevTesteStories(storyindex) {
    if (!isNaN(storyindex)) {
      const {currentIndexImage} = testeStories[storyindex];

      const isFirstImage = currentIndexImage === 0;

      if (!isFirstImage) {
        const arr = testeStories.map((t, index) =>
          index === storyindex
            ? {
                currentIndexImage: t.currentIndexImage - 1,
                qtdImages: t.qtdImages,
                isActive: t.isActive,
              }
            : t,
        );
        await setTesteStories(arr);
      }
    }
  }

  async function handlePrev(index) {
    setPause(true);
    const isFirstImage = activeStory?.currentIndexImage === 0;
    const isFirstStory = currentStoryIndex === 0;

    if (isFirstImage) {
      if (isFirstStory) {
      } else {
        await prevTesteStories(index);
        scroll?.current?.scrollTo({x: (index - 1) * width});
      }
    } else {
      await prevTesteStories(index);
    }
    setPause(false);
  }

  async function handleNext(index) {
    setPause(true);
    const isLastImage =
      activeStory?.currentIndexImage === (activeStory?.qtdImages ?? 0) - 1;

    const isLastStory = currentStoryIndex === testeStories.length - 1;

    if (isLastImage) {
      if (isLastStory) {
        await nextTesteStories(index);
        resetStoriesTesteStories();
        scroll?.current?.scrollTo({x: 0});
      } else {
        await nextTesteStories(index);
        scroll?.current?.scrollTo({x: (index + 1) * width});
      }
    } else {
      await nextTesteStories(index);
    }
    setPause(false);
  }

  return (
    <View style={styles.container}>
      {stories.map((story, index) => (
        <Animated.View style={[getStyle(index)]} key={story.id}>
          <Story
            {...{story}}
            selfIndex={index}
            index={testeStories[index]?.currentIndexImage ?? 0}
            handleNext={handleNext}
            pause={pause}>
            {children}
          </Story>
        </Animated.View>
      ))}
      <ScrollStory
        scroll={scroll}
        stories={stories}
        handleNext={handleNext}
        handlePrev={handlePrev}
        setPause={setPause}
        x={x}
        everyStoryIsInactive={everyStoryIsInactive}
        currentStoryIndex={currentStoryIndex}
        changeActiveStoryTesteStories={changeActiveStoryTesteStories}
      />
    </View>
  );
};

export default Stories;
