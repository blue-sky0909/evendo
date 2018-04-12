## Project about

It is shopping admin dashboard app.
Have built it using React Native, ES6, Redux and Webpack.
I integrated social login like Google and facebook auth.
I used react-navigation and react-google-map.


## Start React Native Packager

Open up another tab in your Terminal and run
```
npm start
```

## Run Android Simulator

* Open up Android Studio and build with gradle
* Start Android emulator
* Run `adb reverse tcp:8081 tcp:8081` to foward port to packager(needed for hot reloading, if you're not developing you can skip this step).
* Run `react-native run-android` from `example` directory


**NOTE**

If the build fails make sure gradle has permission to build from cli
```
cd android
chmod +x gradlew
```

## Run iOS Simulator

You can run this with the react-native cli or Xcode

```
react-native run-ios
```

**NOTE**

If you run into

```
Command failed: /usr/libexec/PlistBuddy -c Print:CFBundleIdentifier build/Build/Products/Debug-iphonesimulator/RNMapboxGLExample.app/Info.plist
Print: Entry, ":CFBundleIdentifier", Does Not Exist
```

Just run the example from Xcode, it seems to be an [issue](https://github.com/facebook/react-native/issues/14423) with RN.
![alt text](https://github.com/blue-sky0909/evendo/blob/master/src/assets/images/dashboard.png)

