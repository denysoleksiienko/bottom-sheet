import { StyleSheet, View, ViewProps } from 'react-native';

const DefaultHandleBar = ({ style, ...otherProps }: ViewProps) => (
  <View style={[styles.container]} {...otherProps}>
    <View style={[styles.handle, style]} />
  </View>
);

export default DefaultHandleBar;

const styles = StyleSheet.create({
  container: {
    padding: 18,
    width: 50,
    alignSelf: 'center',
  },
  handle: {
    height: 4,
    width: 32,
    backgroundColor: '#313131',
    opacity: 0.4,
    alignItems: 'center',
    borderRadius: 50,
  },
});
