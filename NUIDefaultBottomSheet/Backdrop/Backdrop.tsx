import { useAnimatedStyle } from 'react-native-reanimated';
import AnimatedTouchableBackdrop from '../AnimatedTouchableBackdrop/AnimatedTouchableBackdrop';
import type { BackdropProps } from './types';

const Backdrop = ({
  closeOnPress,
  pressHandler,
  animatedBackdropOpacity,
  backdropColor,
}: BackdropProps) => {
  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: animatedBackdropOpacity.value,
  }));

  if (closeOnPress) {
    return (
      <AnimatedTouchableBackdrop
        key="TouchableBackdropMask"
        isPressable
        pressHandler={pressHandler}
        style={[animatedBackdropStyle, { backgroundColor: backdropColor }]}
        touchSoundDisabled
      />
    );
  }

  return (
    <AnimatedTouchableBackdrop
      key="TouchableBackdropMask"
      isPressable={false}
      style={[animatedBackdropStyle, { backgroundColor: backdropColor }]}
    />
  );
};

export default Backdrop;
