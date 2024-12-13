import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ContentPage(): JSX.Element {
  // クエリパラメータから contentName を取得
  const { contentName } = useLocalSearchParams<{ contentName?: string }>();

  return (
    <View style={styles.container}>
      {/* 取得したコンテンツ名を表示 */}
      <Text style={styles.text}>{contentName ?? 'コンテンツページ'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000',
    fontSize: 24,
  },
});
