import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
  images: [],
  currentStoryIndex: 0,
};

const stories_slice = createSlice({
  name: 'stories',
  initialState: INITIAL_STATE,
  reducers: {
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
  create,
  nextImage,
  prevImage,
  updateCurrentStoryIndex,
  reset,
} = stories_slice.actions;

export default stories_slice.reducer;
