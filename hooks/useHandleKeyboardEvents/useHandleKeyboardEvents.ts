import { RefObject, useEffect, useRef } from 'react';
import {
  Keyboard,
  View,
  type EmitterSubscription,
  useWindowDimensions,
} from 'react-native';
import { isAndroid } from '../../utils/native-utils';
import type { HeightAnimationDriver, UseHandleKeyboardEvents } from './types';

const useHandleKeyboardEvents: UseHandleKeyboardEvents = (
  keyboardHandlingEnabled: boolean,
  sheetHeight: number,
  sheetOpen: boolean,
  heightAnimationDriver: HeightAnimationDriver,
  contentWrapperRef: RefObject<View>,
) => {
  const SCREEN_HEIGHT = useWindowDimensions().height;
  const keyboardHideSubscription = useRef<EmitterSubscription>();
  const keyboardShowSubscription = useRef<EmitterSubscription>();

  const unsubscribe = () => {
    keyboardHideSubscription.current?.remove?.();
    keyboardShowSubscription.current?.remove?.();
  };

  useEffect(() => {
    if (keyboardHandlingEnabled) {
      const showEvent = isAndroid ? 'keyboardDidShow' : 'keyboardWillShow';

      keyboardShowSubscription.current = Keyboard.addListener(
        showEvent,
        ({ endCoordinates: { height: keyboardHeight } }) => {
          if (sheetOpen) {
            const keyboardAutoCorrectViewHeight = 50;

            contentWrapperRef.current?.measure?.((...result) => {
              const sheetYOffset = result[5];
              const actualSheetHeight = SCREEN_HEIGHT - sheetYOffset;

              const sheetIsOverlayed =
                actualSheetHeight - sheetHeight < keyboardAutoCorrectViewHeight;
              const remainingSpace = SCREEN_HEIGHT - keyboardHeight;
              const fiftyPercent = 0.5 * remainingSpace;
              const minSheetHeight = 50;

              let newSheetHeight = Math.max(
                minSheetHeight,
                Math.min(sheetHeight, fiftyPercent),
              );
              if (sheetIsOverlayed) {
                newSheetHeight += keyboardHeight;
              }

              heightAnimationDriver(newSheetHeight, 200);
            });
          }
        },
      );

      keyboardHideSubscription.current = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          if (sheetOpen) {
            heightAnimationDriver(sheetHeight, 150);
          }
        },
      );

      return () => unsubscribe();
    }

    return undefined;
  }, [
    keyboardHandlingEnabled,
    sheetHeight,
    SCREEN_HEIGHT,
    sheetOpen,
    heightAnimationDriver,
    contentWrapperRef,
  ]);

  return keyboardHandlingEnabled
    ? { removeKeyboardListeners: unsubscribe }
    : null;
};

export default useHandleKeyboardEvents;
