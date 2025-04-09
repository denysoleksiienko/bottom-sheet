// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { type AnimatedTouchableBackdropProps } from './types';

const ReanimatedPressable = Animated.createAnimatedComponent(Pressable);

const AnimatedTouchableBackdrop = ({
  style,
  isPressable,
  pressHandler,
  ...otherProps
}: AnimatedTouchableBackdropProps) => {
  if (isPressable) {
    return (
      <ReanimatedPressable
        onPress={pressHandler}
        style={[style, StyleSheet.absoluteFillObject]}
        {...otherProps}
      />
    );
  }

  return (
    <Animated.View
      style={[style, StyleSheet.absoluteFillObject]}
      {...otherProps}
    />
  );
};

export default AnimatedTouchableBackdrop;
