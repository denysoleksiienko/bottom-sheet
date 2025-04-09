import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTheme } from '@emotion/react';
import {
  Keyboard,
  StyleProp,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  BOTTOM_THRESHOLD,
  CLOSE_THRESHOLD,
  DEFAULT_ANIMATION,
  DEFAULT_CLOSE_ANIMATION_DURATION,
  DEFAULT_HEIGHT,
  DEFAULT_OPEN_ANIMATION_DURATION,
  HIT_STOP,
  MIN_VELOCITY_Y,
} from '../../../constant/BottomSheet';
import useHandleAndroidBackButtonClose from '../../../hooks/useHandleAndroidBackButtonClose/useHandleAndroidBackButtonClose';
import useHandleKeyboardEvents from '../../../hooks/useHandleKeyboardEvents/useHandleKeyboardEvents';
import { convertHeight } from '../../../utils/convertHeight';
import { statusBarHeight } from '../../../utils/native-utils';
import normalizeHeight from '../../../utils/normalizeHeight';
import Backdrop from '../Backdrop/Backdrop';
import Container from '../Container/Container';
import HandleBar from '../HandleBar/HandleBar';
import { ANIMATIONS, type NUIBottomSheetMethods } from '../types';
import { type NUIBottomSheetProps } from './types';

export const NUIDefaultBottomSheet = forwardRef<
  NUIBottomSheetMethods,
  NUIBottomSheetProps
>(
  (
    {
      overlayed = false,
      backdropColor,
      bottomOffset = 0,
      children: Children,
      animationType = DEFAULT_ANIMATION,
      closeOnBackdropPress = true,
      height = DEFAULT_HEIGHT,
      hideDragHandle = false,
      dragHandleStyle,
      disableBodyPanning = false,
      customDragHandleComponent,
      style,
      contentContainerStyle,
      closeOnDragDown = true,
      containerHeight: passedContainerHeight,
      modal = true,
      enabledBackdrop = true,
      openDuration = DEFAULT_OPEN_ANIMATION_DURATION,
      closeDuration = DEFAULT_CLOSE_ANIMATION_DURATION,
      androidCloseOnBackPress = true,
      onClose,
      onOpen,
      onAnimate,
      disableKeyboardHandling = false,
    },
    ref,
  ) => {
    const { colors } = useTheme();

    const { height: SCREEN_HEIGHT } = useWindowDimensions();
    const [containerHeight, setContainerHeight] = useState(SCREEN_HEIGHT);
    const [sheetOpen, setSheetOpen] = useState(false);

    const animatedContainerHeight = useSharedValue(0);
    const animatedBackdropOpacity = useSharedValue(0);
    const animatedHeight = useSharedValue(0);
    const translateY = useSharedValue(0);

    const contentWrapperRef = useRef<View>(null);

    const animateHeight = useCallback(
      (toValue: number, duration: number) => {
        if (animationType === ANIMATIONS.SLIDE) {
          return withTiming(toValue, {
            duration,
            easing: Easing.out(Easing.exp),
          });
        }
        return withTiming(toValue, { duration, easing: Easing.elastic(1.2) });
      },
      [animationType],
    );

    const animateOpacity = (toValue: number, duration: number) =>
      withTiming(toValue, { duration });

    const animateContainerHeight = (toValue: number, duration: number) =>
      withTiming(toValue + statusBarHeight, { duration });

    const contentContainerAnimatedStyle = useAnimatedStyle(() => {
      let opacity = contentContainerStyle?.opacity ?? 1;
      if (animationType === ANIMATIONS.FADE) {
        opacity = interpolate(
          animatedBackdropOpacity.value,
          [0, 0.5, 1],
          [0, 0.3, 1],
        );
      }

      return {
        height: animatedHeight.value,
        minHeight: animatedHeight.value,
        opacity,
        transform: bottomOffset > 0 ? [{ translateY: translateY.value }] : [],
      };
    }, [animationType, contentContainerStyle, bottomOffset]);

    const containerAnimatedStyle = useAnimatedStyle(() => ({
      height: animatedContainerHeight.value,
    }));

    const convertedHeight = useMemo(() => {
      const newHeight = convertHeight(height, containerHeight, hideDragHandle);

      const curHeight = animatedHeight.value;
      if (sheetOpen && newHeight !== curHeight) {
        if (animationType === ANIMATIONS.FADE) {
          animatedHeight.value = newHeight;
        } else {
          animatedHeight.value = animateHeight(
            newHeight,
            newHeight > curHeight ? openDuration : closeDuration,
          );
        }
      }
      return newHeight;
    }, [
      height,
      containerHeight,
      hideDragHandle,
      animatedHeight,
      sheetOpen,
      animationType,
      animateHeight,
      openDuration,
      closeDuration,
    ]);

    const keyboardHandler = useHandleKeyboardEvents(
      !disableKeyboardHandling,
      convertedHeight,
      sheetOpen,
      (newHeight, duration) => {
        animatedHeight.value = withTiming(newHeight, { duration });
      },
      contentWrapperRef,
    );

    const openBottomSheet = useCallback(() => {
      animatedContainerHeight.value = animateContainerHeight(
        !modal ? convertedHeight : containerHeight,
        0,
      );

      if (animationType === ANIMATIONS.FADE) {
        animatedHeight.value = convertedHeight;
        animatedBackdropOpacity.value = animateOpacity(1, openDuration);
      } else {
        animatedBackdropOpacity.value = animateOpacity(1, openDuration);
        animatedHeight.value = animateHeight(convertedHeight, openDuration);
        if (bottomOffset > 0) {
          translateY.value = withTiming(-bottomOffset, {
            duration: openDuration,
            easing: Easing.in(Easing.exp),
          });
        }
      }
      setSheetOpen(true);
      onOpen?.();
    }, [
      animatedContainerHeight,
      modal,
      convertedHeight,
      containerHeight,
      animationType,
      onOpen,
      animatedHeight,
      animatedBackdropOpacity,
      openDuration,
      animateHeight,
      bottomOffset,
      translateY,
    ]);

    const closeBottomSheet = useCallback(() => {
      animatedBackdropOpacity.value = withTiming(
        0,
        { duration: closeDuration },
        (finished) => {
          if (finished) {
            if (animationType === ANIMATIONS.FADE) {
              animatedContainerHeight.value = withTiming(0, {
                duration: closeDuration,
              });
              animatedHeight.value = 0;
            } else {
              animatedHeight.value = withTiming(0, {
                duration: closeDuration,
              });
              animatedContainerHeight.value = withTiming(0, {
                duration: closeDuration,
              });
            }
            if (bottomOffset > 0) {
              translateY.value = withTiming(bottomOffset + BOTTOM_THRESHOLD, {
                duration: closeDuration,
                easing: Easing.out(Easing.exp),
              });
            }
          }
        },
      );

      setSheetOpen(false);
      keyboardHandler?.removeKeyboardListeners();
      Keyboard.dismiss();
      onClose?.();
    }, [
      animatedBackdropOpacity,
      closeDuration,
      keyboardHandler,
      onClose,
      animationType,
      bottomOffset,
      animatedContainerHeight,
      animatedHeight,
      translateY,
    ]);

    useAnimatedReaction(
      () => {
        if (animationType === ANIMATIONS.FADE) {
          return animatedBackdropOpacity.value;
        }
        return animatedHeight.value;
      },
      (val) => {
        if (onAnimate && typeof onAnimate === 'function') {
          runOnJS(onAnimate)(val);
        }
      },
      [onAnimate, animationType],
    );

    useLayoutEffect(() => {
      if (!modal) return;
      if (typeof passedContainerHeight === 'number') {
        const normalized = normalizeHeight(passedContainerHeight);
        setContainerHeight(normalized);
        if (sheetOpen) {
          animatedContainerHeight.value = normalized;
        }
      } else if (
        typeof passedContainerHeight === 'undefined' &&
        containerHeight !== SCREEN_HEIGHT
      ) {
        setContainerHeight(SCREEN_HEIGHT);
        if (sheetOpen) {
          animatedContainerHeight.value = SCREEN_HEIGHT;
        }
      }
    }, [
      passedContainerHeight,
      SCREEN_HEIGHT,
      sheetOpen,
      containerHeight,
      modal,
      animatedContainerHeight,
    ]);

    // Handle hardware back button on Android
    useHandleAndroidBackButtonClose(
      closeBottomSheet,
      sheetOpen,
      androidCloseOnBackPress,
    );

    useImperativeHandle(ref, () => ({
      open() {
        openBottomSheet();
      },
      close() {
        closeBottomSheet();
      },
    }));

    const dismissKeyboard = () => {
      Keyboard.dismiss();
    };

    const dragGesture = Gesture.Pan()
      .hitSlop(HIT_STOP)
      .enabled(!disableBodyPanning)
      .onUpdate((event) => {
        if (event.translationY > 0) {
          animatedBackdropOpacity.value =
            1 - event.translationY / convertedHeight;
          if (animationType !== ANIMATIONS.FADE) {
            animatedHeight.value = convertedHeight - event.translationY;
          }
          if (bottomOffset > 0) {
            translateY.value = withTiming(bottomOffset + BOTTOM_THRESHOLD, {
              duration: closeDuration,
              easing: Easing.out(Easing.exp),
            });
          }
          runOnJS(dismissKeyboard)();
        }
      })
      .onEnd((event) => {
        if (
          closeOnDragDown &&
          (event.translationY > CLOSE_THRESHOLD ||
            event.velocityY > MIN_VELOCITY_Y)
        ) {
          runOnJS(closeBottomSheet)();
        } else {
          animatedBackdropOpacity.value = 1;
          animatedHeight.value = withSpring(convertedHeight, {
            damping: 15,
            stiffness: 150,
          });
        }
      });

    const ChildNodes =
      typeof Children === 'function' ? (
        <Children animatedHeight={animatedHeight} />
      ) : (
        Children
      );

    const styles: StyleProp<ViewStyle> = {
      backgroundColor: colors.primary.white,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      overflow: 'hidden',
    };

    return (
      <Container style={[containerAnimatedStyle]}>
        {modal && enabledBackdrop && (
          <Backdrop
            animatedBackdropOpacity={animatedBackdropOpacity}
            backdropColor={backdropColor ?? colors.overlay}
            closeOnPress={closeOnBackdropPress}
            pressHandler={closeBottomSheet}
          />
        )}
        <GestureDetector gesture={dragGesture}>
          <Animated.View
            key="BottomSheetContentContainer"
            ref={contentWrapperRef}
            style={[styles, style, contentContainerAnimatedStyle]}
          >
            <HandleBar
              animatedHeight={animatedHeight}
              customDragHandleComponent={customDragHandleComponent}
              dragHandleStyle={dragHandleStyle}
            />
            <View style={[contentContainerStyle, { flexGrow: 1 }]}>
              {ChildNodes}
            </View>
          </Animated.View>
        </GestureDetector>
      </Container>
    );
  },
);

NUIDefaultBottomSheet.displayName = 'NUIDefaultBottomSheet';
