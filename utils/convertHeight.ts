import { Dimensions } from 'react-native';
import { DEFAULT_HANDLE_BAR_DEFAULT_HEIGHT } from '../constant/BottomSheet';

export const parsePercentage = (height: string): number => {
  if (!height.endsWith('%') || height.length <= 1 || height.length > 4) {
    throw new Error(
      'Invalid `height` prop: must be a percentage string (e.g., "50%").',
    );
  }

  const parsed = parseInt(height.slice(0, -1), 10);
  if (Number.isNaN(parsed)) {
    throw new Error('Invalid `height` prop: not a valid percentage.');
  }

  return Math.min(100, Math.abs(parsed));
};

export const convertHeight = (
  height: string | number,
  containerHeight: number,
  handleBarHidden: boolean,
): number => {
  const SCREEN_HEIGHT = Dimensions.get('window').height;

  if (typeof height === 'number') {
    return Math.min(
      Math.max(height, 0),
      containerHeight === SCREEN_HEIGHT && !handleBarHidden
        ? containerHeight - DEFAULT_HANDLE_BAR_DEFAULT_HEIGHT
        : containerHeight,
    );
  }

  const percentage = parsePercentage(height);
  let computedHeight = Math.floor((percentage / 100) * containerHeight);

  if (containerHeight === SCREEN_HEIGHT && !handleBarHidden) {
    computedHeight -= DEFAULT_HANDLE_BAR_DEFAULT_HEIGHT;
  }

  return computedHeight;
};
