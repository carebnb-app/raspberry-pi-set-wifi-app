import React from 'react'

import { Text } from 'react-native'

import Touchable from '../touchable'

import removeAccents from 'remove-accents'
import mem from 'mem'

import Style from './style'

const separateHilight = mem((text, hilight) => {
  const textWithoutAccents = removeAccents(String(text || '')).toLowerCase()
  const indexOfHilight = textWithoutAccents.indexOf(removeAccents(String(hilight || '')).toLowerCase())

  const hilighted = text.substring(indexOfHilight, hilight.length + indexOfHilight)
  const start = indexOfHilight === 0 ? null : text.substring(0, indexOfHilight)
  const end = indexOfHilight === (text.length - 1) ? null : text.substring(indexOfHilight + hilight.length, text.length)

  return {
    start,
    hilighted,
    end
  }
}, { maxAge: 5000 })

const TouchableWithHilightedText = ({ onPress, children, hilight }) => {
  const hilights = separateHilight(children, hilight)
  return (
    <Touchable onPress={onPress}>
      <Text style={Style.normal}>
        {hilights.start}
        <Text style={Style.hilight}>{hilights.hilighted}</Text>
        {hilights.end}
      </Text>
    </Touchable>
  )
}

export default TouchableWithHilightedText
