import React from 'react';
import { OpaqueColorValue, ViewProps, ViewStyle } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import { ANIMATIONS } from '../types';

type AnimationType = ANIMATIONS | Lowercase<keyof typeof ANIMATIONS>;

export type NUIBottomSheetProps = {
  height?: number | string;
  style?: ViewStyle;
  overlayed?: boolean;
  enabledBackdrop?: boolean;
  bottomOffset?: number;
  contentContainerStyle?: ViewStyle;
  containerHeight?: ViewStyle['height'];
  animationType?: AnimationType;
  backdropColor?: string | OpaqueColorValue;
  closeOnBackdropPress?: boolean;
  closeOnDragDown?: boolean;
  hideDragHandle?: boolean;
  customDragHandleComponent?: React.FC<{
    animatedHeight: SharedValue<number>;
  }>;
  dragHandleStyle?: ViewStyle;
  disableBodyPanning?: boolean;
  modal?: boolean;
  children:
    | ViewProps['children']
    | React.FunctionComponent<{ animatedHeight: SharedValue<number> }>;
  openDuration?: number;
  closeDuration?: number;
  androidCloseOnBackPress?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  onAnimate?: (animatedHeightOrOpacity: number) => void;
  disableKeyboardHandling?: boolean;
};
