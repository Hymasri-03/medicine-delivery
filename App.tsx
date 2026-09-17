import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { styles } from './src/theme/styles';
import { COLORS } from './src/theme/colors';
import { AppProvider } from './src/context/AppContext';
import RootNavigator from './src/navigation/RootNavigator';
import ToastOverlay from './src/components/ToastOverlay';

export default function App() {
  return (
    <AppProvider>
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.card} />
        <RootNavigator />
        <ToastOverlay />
      </SafeAreaView>
    </AppProvider>
  );
}
