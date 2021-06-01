import {createSlice} from '@reduxjs/toolkit';

/* 

stories = [
  story,
  story,
  story,
]

story = {
  currentIndexImage: number; // current index of the imamge
  qtdImages: number;
  isActive: boolean; // tell if the story is showing
}

*/

const INITIAL_STATE = {
  images: [],
  currentStoryIndex: 0,

  stories: [],
};

const stories_slice = createSlice({
  name: 'stories',
  initialState: INITIAL_STATE,
  reducers: {
    initStories: (state, {payload: {qtdStories, arrQtdImages}}) => {
      state.stories = [...Array(qtdStories)].map((arr, index) => ({
        currentIndexImage: 0,
        qtdImages: arrQtdImages[index],
        isActive: false,
      }));

      state.stories[0].isActive = true;
    },
    next: state => {
      state.stories.forEach((story, index) => {
        if (story.isActive && story.currentIndexImage + 1 === story.qtdImages) {
          story.isActive = false;
          state.stories[index + 1].isActive = true;
          return;
        }

        return story.isActive && story.currentIndexImage++;
      });
    },
    prev: state => {
      state.stories.forEach((story, index) => {
        console.log('prev 1', story);
        if (story.isActive && story.currentIndexImage === 0) {
          story.isActive = false;
          state.stories[index - 1].isActive = true;
          return;
        }
        console.log('prev 2');

        return story.isActive && story.currentIndexImage--;
      });
    },

    create: (state, {payload}) => {
      state.images = [...Array(payload.totalStories)].map((arr, index) => ({
        index: 0,
        total: payload.stories[index].photos.length,
      }));
    },
    nextImage: (state, {payload}) => {
      const currentStory = state.images[payload.storyIndex];
      if (currentStory.index < currentStory.total - 1)
        state.images[payload.storyIndex].index++;
    },
    prevImage: (state, {payload}) => {
      const currentStory = state.images[payload.storyIndex];
      if (currentStory.index > 0) state.images[payload.storyIndex].index--;
    },
    updateCurrentStoryIndex: (state, {payload}) => {
      state.currentStoryIndex = payload.index;
    },
    reset: state => {
      state.currentStoryIndex = 0;
      state.images = state.images.map(arr => ({index: 0, total: arr.total}));
    },
  },
});

export const {
  initStories,
  next,
  prev,

  create,
  nextImage,
  prevImage,
  updateCurrentStoryIndex,
  reset,
} = stories_slice.actions;

export default stories_slice.reducer;
