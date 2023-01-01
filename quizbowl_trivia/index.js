import { registerRootComponent } from 'expo';
import { Text } from 'react-native';
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
registerRootComponent(App);
