import React from 'react'

import {
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform
} from 'react-native'

const Touchable = Platform.OS === 'ios' ? TouchableOpacity : ({ circular = false, white = false, children, ...props }) => (
  <TouchableNativeFeedback
    useForeground
    background={TouchableNativeFeedback.Ripple((white ? '#fff' : '#111'), circular)}
    {...props}
  >
    {children}
  </TouchableNativeFeedback>
)

export default Touchable
