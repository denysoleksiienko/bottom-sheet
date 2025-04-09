import { View } from 'react-native';
import DefaultHandleBar from '../DefaultHandleBar/DefaultHandleBar';
import { HandleBarProps } from './types';

const HandleBar = ({
  animatedHeight,
  customDragHandleComponent,
  dragHandleStyle,
}: HandleBarProps) => {
  const CustomHandleBar = customDragHandleComponent;

  return (
    <View style={{ alignSelf: 'center' }}>
      {CustomHandleBar && typeof CustomHandleBar === 'function' ? (
        <CustomHandleBar animatedHeight={animatedHeight} />
      ) : (
        <DefaultHandleBar style={dragHandleStyle} />
      )}
    </View>
  );
};

export default HandleBar;
