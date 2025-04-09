import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

type ContainerProps = React.ComponentProps<typeof Animated.View>;

const Container = forwardRef<Animated.View, ContainerProps>(
  ({ style, ...otherProps }, ref) => (
    <Animated.View
      ref={ref}
      style={[styles.container, style]}
      {...otherProps}
    />
  ),
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'flex-end',
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
});

Container.displayName = 'Container';

export default Container;
