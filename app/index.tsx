import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, FlatList, ViewToken, Text, TouchableOpacity } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useRouter } from 'expo-router';

const { height, width } = Dimensions.get('window');

// 動画アイテムの型
type VideoItem = {
  id: string;
  uri: string;
  title: string;
  description: string;
};

// コンテンツの型
type Content = {
  id: string;
  name: string;     // "コンテンツ1" "コンテンツ2" "コンテンツ3" など
  videos: VideoItem[];
};

// コンテンツ定義
const contents: Content[] = [
  {
    id: '1',
    name: 'コンテンツ1',
    videos: [
      { id: '1-1', uri: 'https://www.w3schools.com/html/mov_bbb.mp4', title: 'コンテンツ1 - ビデオ1', description: 'コンテンツ1のビデオ1の説明' },
      { id: '1-2', uri: 'https://www.w3schools.com/html/movie.mp4',   title: 'コンテンツ1 - ビデオ2', description: 'コンテンツ1のビデオ2の説明' },
    ],
  },
  {
    id: '2',
    name: 'コンテンツ2',
    videos: [
      { id: '2-1', uri: 'https://www.w3schools.com/html/mov_bbb.mp4', title: 'コンテンツ2 - ビデオ1', description: 'コンテンツ2のビデオ1の説明' },
      { id: '2-2', uri: 'https://www.w3schools.com/html/movie.mp4',   title: 'コンテンツ2 - ビデオ2', description: 'コンテンツ2のビデオ2の説明' },
    ],
  },
  {
    id: '3',
    name: 'コンテンツ3',
    videos: [
      { id: '3-1', uri: 's/html/mov_bbb.mp4', title: 'コンテンツ3 - ビデオ1', description: 'コンテンツ3のビデオ1の説明' },
      { id: '3-2', uri: 'https://www.w3schools.com/html/movie.mp4',   title: 'コンテンツ3 - ビデオ2', description: 'コンテンツ3のビデオ2の説明' },
    ],
  },
];

// コンテンツ配列から動画をフラットに抽出
// 各動画にcontentIdやcontentNameを付与
const videoList = contents.flatMap((content) =>
  content.videos.map((video) => ({
    ...video,
    contentId: content.id,
    contentName: content.name,
  }))
);

export default function HomeScreen(): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const videoRefs = useRef<(Video | null)[]>([]);
  const router = useRouter();

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
      <FlatList<(VideoItem & { contentId: string; contentName: string })>
        data={videoList}
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
            {/* タイトル・説明文 */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
            {/* 各動画に対応したボタン。押すとcontentページへ遷移。 */}
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => router.push({ pathname: '/content', params: { contentName: item.contentName } })}
            >
              <Text style={styles.buttonText}>{item.contentName}</Text>
            </TouchableOpacity>
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
    top: '80%',
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
  circleButton: {
    position: 'absolute',
    right: 20,
    top: '80%',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
