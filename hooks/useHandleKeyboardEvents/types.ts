import React from 'react';
import { View } from 'react-native';

export type HookReturn = {
  removeKeyboardListeners: () => void;
} | null;

export type UseHandleKeyboardEvents = (
  keyboardHandlingEnabled: boolean,
  sheetHeight: number,
  sheetOpen: boolean,
  SheetHeightAnimationDriver: HeightAnimationDriver,
  contentWrapperRef: React.RefObject<View>,
) => HookReturn;

export type HeightAnimationDriver = (
  height: number,
  duration: number,
) => void | number;
