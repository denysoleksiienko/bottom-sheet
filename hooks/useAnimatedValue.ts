import { useSharedValue } from 'react-native-reanimated';

const useAnimatedValue = (initialValue = 0) => useSharedValue(initialValue);

export default useAnimatedValue;
