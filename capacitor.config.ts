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
  },
};

export default config;
