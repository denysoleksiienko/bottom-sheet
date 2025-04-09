import { Dimensions } from 'react-native';

const normalizeHeight = (height?: number): number => {
  const SCREEN_HEIGHT = Dimensions.get('window').height;

  if (typeof height !== 'number') {
    return SCREEN_HEIGHT;
  }

  return Math.min(Math.max(height, 0), SCREEN_HEIGHT);
};

export default normalizeHeight;
