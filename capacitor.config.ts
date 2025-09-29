import { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'io.saws.aviation',
  appName: 'SAWS',
  webDir: 'www',
  server: {
    androidScheme: 'http',
    cleartext: true,
  },

  plugins: {
     Keyboard: {
      resize: KeyboardResize.Ionic,
    },
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      androidSplashResourceName: "splash",
      iosSplashResourceName: "splash"
        },
         StatusBar: {
      overlaysWebView: false, 
    },
      }
    
};

export default config;
