import React from 'react';
import { ViewStyle } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

export type HandleBarProps = {
  animatedHeight: SharedValue<number>;
  customDragHandleComponent?: React.FC<{
    animatedHeight: SharedValue<number>;
  }>;
  dragHandleStyle?: ViewStyle;
};
