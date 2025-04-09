import { OpaqueColorValue } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

export type BackdropProps = {
  animatedBackdropOpacity: SharedValue<number>;
  closeOnPress: boolean;
  pressHandler: () => void;
  backdropColor?: string | OpaqueColorValue;
};
