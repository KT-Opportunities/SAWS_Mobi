import { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'io.saws.aviation',
  appName: 'SAWS',
  webDir: 'www',
  server: {
    androidScheme: 'http',
    iosScheme: 'ionic',
    cleartext: true,
    allowNavigation: [
      'qa.j-cred.co.za',
      '*.j-cred.co.za'
    ]
  },

  plugins: {
     Keyboard: {
      resize: KeyboardResize.Body, 
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
