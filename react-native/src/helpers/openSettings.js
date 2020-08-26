import { Linking, Platform } from 'react-native'

import AndroidOpenSettings from 'react-native-android-open-settings'

export const openSettings = () => {
    if (Platform.OS === 'ios') Linking.openURL('App-Prefs:root=WIFI')
    else if (Platform.OS === 'android') AndroidOpenSettings.wifiSettings()
}