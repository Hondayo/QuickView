import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ContentScreen() {
  const { contentId } = useLocalSearchParams();

  // コンテンツ定義
  const contents = [
    {
      id: 1,
      image: "../assets/",
      title: "斉木楠雄のΨ難",
      productionYear: 2018,
      ageRestriction: 13,
    },
    {
      id: 2,
      image: "https://example.com/spiderman.jpg",
      title: "アメイジング・スパイダーマン",
      productionYear: 2014,
      ageRestriction: 13,
    },
    {
      id: 3,
      image: "https://example.com/roppongi.jpg",
      title: "六本木クラス",
      productionYear: 2022,
      ageRestriction: 13,
    },
  ];

  // URLパラメータの contentId に対応するコンテンツを取得
  const content = contents.find((c) => c.id === Number(contentId));

  if (!content) {
    return (
      <View style={styles.container}>
        <Text>コンテンツが見つかりませんでした</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 画像表示 */}
      {/* content.image は上記の "https://example.com/～～.jpg" などのURLを想定 */}
      <Image 
        source={{ uri: content.image }} 
        style={styles.image}
      />
      {/* タイトルなどのテキスト表示 */}
      <Text style={styles.text}>タイトル: {content.title}</Text>
      <Text style={styles.text}>制作年: {content.productionYear}</Text>
      <Text style={styles.text}>年齢制限: {content.ageRestriction}</Text>
      {/* 他にも作品情報や動画一覧などを表示していく */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: '#fff',
  },
});