# SmartBank React Native + Expo EAS Build Guide

This guide walks you through converting the SmartBank web app logic into a React Native app and building an Android APK using Expo EAS (Expo Application Services).

## Prerequisites
1. Node.js installed on your machine
2. An Expo account (create one at [expo.dev](https://expo.dev))

## Step 1: Initialize the React Native App
Create a new Expo project for SmartBank:
```bash
npx create-expo-app smartbank-mobile
cd smartbank-mobile
```

## Step 2: Install Required Dependencies
Install the React Native equivalents of the libraries used in the web app:
```bash
npx expo install react-navigation/native react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context
npx expo install lucide-react-native expo-speech expo-camera
```

## Step 3: Architecture Adjustments (Web to Mobile)
React Native doesn't use HTML (`div`, `span`, CSS). You must convert the web components:
1. `<div>` becomes `<View>`
2. `<p>` or `<h2>` becomes `<Text>`
3. `className` / `styles.css` becomes `StyleSheet.create({...})`
4. React Router `BrowserRouter` becomes `NavigationContainer` with `@react-navigation/native`

Move logic hooks (like `useTheme.js` modifying `document.body`) to use React Context instead.

## Step 4: Login to Expo CLI
In your terminal, log in to your Expo account:
```bash
npx expo login
```

## Step 5: Initialize EAS
Run the following command to configure your project for EAS builds:
```bash
eas build:configure
```
This generates an `eas.json` file in your project root. 

## Step 6: Configure `eas.json` for APK
By default, EAS builds `.aab` (Android App Bundle) which is required for the Google Play Store. To build an installable `.apk` for direct testing, update your `eas.json` to look like this:

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}
```

## Step 7: Build the Android APK
Run the following command to start the build process on Expo's servers:
```bash
eas build -p android --profile preview
```

## Step 8: Download & Install
1. The terminal will display a link to the Expo Dashboard.
2. Once the build succeeds (~5-10 minutes), download the `.apk` file.
3. Transfer the `.apk` to your Android device.
4. Enable "Install from Unknown Sources" and install the app!
