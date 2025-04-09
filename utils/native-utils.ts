import { Platform, StatusBar } from 'react-native';

export const isAndroid = Platform.OS === 'android';
export const isIos = Platform.OS === 'ios';

export const statusBarHeight: number = StatusBar.currentHeight || 0;
