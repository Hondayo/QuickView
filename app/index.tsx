import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, FlatList, ViewToken, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const { height, width } = Dimensions.get('window');

type VideoItem = {
  id: string;
  uri: string;
  title: string;
  description: string;
};

const videoData: VideoItem[] = [
  { id: '1', uri: 'https://www.w3schools.com/html/mov_bbb.mp4', title: 'Video 1', description: 'This is the first video description.' },
  { id: '2', uri: 'https://www.w3schools.com/html/movie.mp4', title: 'Video 2', description: 'This is the second video description.' },
  { id: '3', uri: 'https://www.w3schools.com/html/mov_bbb.mp4', title: 'Video 3', description: 'This is the third video description.' },
];

export default function HomeScreen(): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const videoRefs = useRef<(Video | null)[]>([]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems && viewableItems.length > 0 && typeof viewableItems[0].index === 'number') {
        const index = viewableItems[0].index;
        setCurrentIndex(index);
      }
    },
    []
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  return (
    <View style={styles.container}>
      <FlatList<VideoItem>
        data={videoData}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.videoContainer}>
            <Video
              ref={(ref) => {
                videoRefs.current[index] = ref;
              }}
              source={{ uri: item.uri }}
              style={styles.video}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={currentIndex === index}
              isLooping
            />
            {/* タイトル・説明文を表示するコンテナ */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  video: {
    width: width,
    height: height,
  },
  textContainer: {
    position: 'absolute',
    left: 20,
    top: '80%', // 画面中央より少し下(50%より下)
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#fff',
    fontSize: 16,
  },
});
