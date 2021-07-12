/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

// import {Asset} from 'expo-asset';
import React, {useState} from 'react';

// import {SafeAreaView, StyleSheet} from 'react-native';
import Stories from './src/components/Stories';

import stories from './src/data/stories';
import stories2 from './src/data/stories2';

const App = () => {
  const [ready, setReady] = useState(false);

  /*  useEffect(() => {
    const request = async () => {
      await Promise.all(
        stories.map(story =>
          Promise.all([
            Asset.loadAsync(story.source),
            Asset.loadAsync(story.avatar),
          ]),
        ),
      );

      setReady(true);
    };

    request();
  }, []); */

  // console.log('{...{stories2}}', stories2.length);

  return <Stories {...{stories: stories2}} />;
};

export default App;
