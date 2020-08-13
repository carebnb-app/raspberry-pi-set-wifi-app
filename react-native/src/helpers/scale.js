import { Dimensions } from 'react-native'

const guidelineBaseWidth = 375
const guidelineBaseHeight = 812

const { width, height } = Dimensions.get('window')

export const scale = size => width / guidelineBaseWidth * size
export const verticalScale = size => height / guidelineBaseHeight * size
export const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor
