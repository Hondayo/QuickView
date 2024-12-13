import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// アプリ起動直後のスプラッシュスクリーンが自動で消えないようにする
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // システムのダークモード / ライトモード設定を取得するフック
  const colorScheme = useColorScheme();

  // カスタムフォントを読み込むためのフック
  const [loaded] = useFonts({
    // "SpaceMono" というフォント名で、自前のttfファイルを読み込む
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    // フォント読み込みが完了したらスプラッシュスクリーンを非表示にする
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // フォントがまだ読み込まれていない場合は何も表示しない
  if (!loaded) {
    return null;
  }

  return (
    // テーマプロバイダを使って、ダークモード／ライトモードに応じたテーマを適用
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* スタックナビゲーションを定義 */}
      <Stack>
        {/*「index」画面をスタックに追加 */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      {/* ステータスバーを自動的に適切なスタイルに */}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
