import { useEffect, useRef } from 'react';
import { BackHandler, type NativeEventSubscription } from 'react-native';
import type { UseHandleAndroidBackButtonClose } from './types';

const useHandleAndroidBackButtonClose: UseHandleAndroidBackButtonClose = (
  closeSheet,
  sheetOpen = false,
  shouldClose = true,
) => {
  const handler = useRef<NativeEventSubscription | null>(null);

  useEffect(() => {
    handler.current = BackHandler.addEventListener('hardwareBackPress', () => {
      if (sheetOpen) {
        if (shouldClose) {
          closeSheet();
        }
        return true;
      }
      return false;
    });

    return () => {
      handler.current?.remove?.();
    };
  }, [shouldClose, closeSheet, sheetOpen]);
};

export default useHandleAndroidBackButtonClose;
