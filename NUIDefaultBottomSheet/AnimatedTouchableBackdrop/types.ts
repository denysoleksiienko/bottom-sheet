import { ReactNode } from 'react';
import {
  GestureResponderEvent,
  TouchableOpacityProps,
  ViewProps,
} from 'react-native';
import { SharedValue, AnimatedProps } from 'react-native-reanimated';

export type RegularPropsFor<ComponentType extends 'Touch' | 'View'> =
  AnimatedProps<
    ComponentType extends 'Touch' ? TouchableOpacityProps : ViewProps
  > & {
    children?: ReactNode | SharedValue<ReactNode>;
  };

export type PropsWithHandler = RegularPropsFor<'Touch'> & {
  isPressable: true;
  pressHandler: (evt: GestureResponderEvent) => void;
};

export type PropsWithoutHandler = RegularPropsFor<'View'> & {
  isPressable?: false;
  pressHandler?: never;
};

export type AnimatedTouchableBackdropProps =
  | PropsWithHandler
  | PropsWithoutHandler;
