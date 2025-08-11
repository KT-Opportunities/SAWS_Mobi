import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.saws.aviation',
  appName: 'SAWS',
  webDir: 'www',
  server: {
    androidScheme: 'http',
    cleartext: true,
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      androidSplashResourceName: "splash",
      iosSplashResourceName: "splash"
        }
      }
    
};

export default config;
