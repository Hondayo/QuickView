import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, FlatList, ViewToken, Text, TouchableOpacity } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useRouter } from 'expo-router';

// --------------------
//  型定義
// --------------------
export type ShortVideo = {
  /** ショート動画ID */
  id: number;
  /** ショート動画のURL(require) */
  shortVideoUrl: any; // require(...) は型的に any or number
};

export type ShortVideoInfo = {
  /** ショート動画情報ID */
  id: number;
  /** 紐づくショート動画ID */
  shortVideoId: number;
  /** 紐づくコンテンツID (アニメ/映画など) */
  contentId: number;
  /** タイトル */
  title: string;
  /** 説明文 */
  description: string;
};

// ここでは videos フィールドを持つ想定にします。
export type VideoItem = {
  id: number;
  video_id: number; // ショート動画の "id" と紐づけるためのキー
  title: string;
  description: string;
};

export type Content = {
  id: number;
  name: string;
  productionYear: number;
  ageRestriction: number;
  videos: VideoItem[];
};

//  デバイスの画面サイズ取得
const { height, width } = Dimensions.get('window');

//  ショート動画の実ファイル情報
const shortVideoAssets: ShortVideo[] = [
  { id: 1, shortVideoUrl: require('../assets/videos/shorts/斉木楠雄1.mp4')},
  { id: 2, shortVideoUrl: require('../assets/videos/shorts/斉木楠雄2.mp4')},
  { id: 3, shortVideoUrl: require('../assets/videos/shorts/11.mp4')},
  { id: 4, shortVideoUrl: require('../assets/videos/shorts/12.mp4')},
  { id: 5, shortVideoUrl: require('../assets/videos/shorts/13.mp4')},
  { id: 6, shortVideoUrl: require('../assets/videos/shorts/14.mp4')},
  { id: 7, shortVideoUrl: require('../assets/videos/shorts/21.mp4')},
  { id: 8, shortVideoUrl: require('../assets/videos/shorts/22.mp4')},
  { id: 9, shortVideoUrl: require('../assets/videos/shorts/23.mp4')},
];

//  ショート動画の付随情報
//  (タイトルや説明など、各 shortVideoId に紐づくメタ情報)
const shortVideoInfo: ShortVideoInfo[] = [
  {
    id: 1,
    shortVideoId: 1,
    contentId: 1,
    title: '斉木楠雄のΨ難1',
    description: '斉木楠雄のΨ難エピソード1です'
  },
  {
    id: 2,
    shortVideoId: 2,
    contentId: 1,
    title: '斉木楠雄のΨ難2',
    description: '斉木楠雄のΨ難エピソード2です'
  },
  {
    id: 3,
    shortVideoId: 3,
    contentId: 2,
    title: 'アメイジング・スパイダーマン1',
    description: 'アメイジング・スパイダーマンのエピソード1です'
  },
  {
    id: 4,
    shortVideoId: 4,
    contentId: 2,
    title: 'アメイジング・スパイダーマン2',
    description: 'アメイジング・スパイダーマンのエピソード2です'
  },
  {
    id: 5,
    shortVideoId: 5,
    contentId: 2,
    title: 'アメイジング・スパイダーマン3',
    description: 'アメイジング・スパイダーマンのエピソード3です'
  },
  {
    id: 6,
    shortVideoId: 6,
    contentId: 2,
    title: 'アメイジング・スパイダーマン4',
    description: 'アメイジング・スパイダーマンのエピソード4です'
  },
  {
    id: 7,
    shortVideoId: 7,
    contentId: 3,
    title: '六本木クラス1',
    description: '六本木クラスのエピソード1です'
  },
  {
    id: 8,
    shortVideoId: 8,
    contentId: 3,
    title: '六本木クラス2',
    description: '六本木クラスのエピソード2です'
  },
  {
    id: 9,
    shortVideoId: 9,
    contentId: 3,
    title: '六本木クラス3',
    description: '六本木クラスのエピソード3です'
  },
];

//  コンテンツ(作品) 情報
const contents: Content[] = [
  {
    id: 1,
    name: '斉木楠雄のΨ難',
    productionYear: 2018,
    ageRestriction: 13,
    videos: [
      {
        id: 1,
        video_id: 1,
        title: '斉木楠雄のΨ難1',
        description: '斉木楠雄のΨ難エピソード1です',
      },
      {
        id: 2,
        video_id: 2,
        title: '斉木楠雄のΨ難2',
        description: '斉木楠雄のΨ難エピソード2です',
      },
    ],
  },
  {
    id: 2,
    name: 'アメイジング・スパイダーマン',
    productionYear: 2014,
    ageRestriction: 13,
    videos: [
      {
        id: 3,
        video_id: 3,
        title: 'アメイジング・スパイダーマン1',
        description: 'アメイジング・スパイダーマンのエピソード1です',
      },
      {
        id: 4,
        video_id: 4,
        title: 'アメイジング・スパイダーマン2',
        description: 'アメイジング・スパイダーマンのエピソード2です',
      },
      {
        id: 5,
        video_id: 5,
        title: 'アメイジング・スパイダーマン3',
        description: 'アメイジング・スパイダーマンのエピソード3です',
      },
      {
        id: 6,
        video_id: 6,
        title: 'アメイジング・スパイダーマン4',
        description: 'アメイジング・スパイダーマンのエピソード4です',
      },
    ],
  },
  {
    id: 3,
    name: '六本木クラス',
    productionYear: 2022,
    ageRestriction: 13,
    videos: [
      {
        id: 7,
        video_id: 7,
        title: '六本木クラス1',
        description: '六本木クラスのエピソード1です',
      },
      {
        id: 8,
        video_id: 8,
        title: '六本木クラス2',
        description: '六本木クラスのエピソード2です',
      },
      {
        id: 9,
        video_id: 9,
        title: '六本木クラス3',
        description: '六本木クラスのエピソード3です',
      },
    ],
  },
];

//  コンテンツ配列から動画をフラットに抽出
//  各動画に contentId や contentName を付与
const videoList = contents.flatMap((content) =>
  content.videos.map((video) => ({
    ...video,
    contentId: content.id,
    contentName: content.name,
  }))
);

// 画面本体
export default function HomeScreen(): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const videoRefs = useRef<(Video | null)[]>([]);
  const router = useRouter();

  // 表示中のアイテムが変化した際のコールバック
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
    itemVisiblePercentThreshold: 50, // 50%以上見えたら「見えている」と判定
  };

  return (
    <View style={styles.container}>
      <FlatList
        // ここでは型パラメータを簡略化し、直接 videoList の型推論に任せています
        data={videoList}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <View style={styles.videoContainer}>
            <Video
              ref={(ref) => {
                videoRefs.current[index] = ref;
              }}
              // shortVideoAssets から video_id と一致するものを探してソースを取得
              source={shortVideoAssets.find((asset) => asset.id === item.video_id)?.shortVideoUrl}
              style={styles.video}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={currentIndex === index}
              isLooping
            />

            {/* タイトル・説明文 */}
            <View style={styles.textContainer}>
              <TouchableOpacity
                onPress={() => {
                  router.push(`/contents/${item.contentId}`)
                }}
              >
                <Text style={styles.title}>{item.title}</Text>
              </TouchableOpacity>
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

// --------------------
//  スタイル定義
// --------------------
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
});
