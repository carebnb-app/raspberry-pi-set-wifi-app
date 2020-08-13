import { StyleSheet, Platform } from 'react-native'

import { scale } from '../../helpers/scale'

export default StyleSheet.create({
  textInput: {
    flex: 1,
    paddingBottom: scale(5),
    fontSize: scale(18),
    color: 'rgb(44, 44, 44)'
  },

  'textInput-variant-dark': {
    color: '#000'
  },

  'textInput-variant-light': {
    color: '#fff'
  },

  container: {
    flexDirection: 'row',
    borderBottomColor: '#333',
    borderBottomWidth: scale(2),
    marginBottom: scale(28),
    marginTop: scale(Platform.OS === 'android' ? 10 : 19)
  },

  'container-variant-dark': {
    borderBottomColor: '#000'
  },

  'container-variant-light': {
    borderBottomColor: '#ffffffa0'
  },

  labelContainer: {
    position: 'absolute',
    marginTop: scale(Platform.OS === 'android' ? -6 : -19)
  },

  labelText: {
    fontSize: scale(12),
    color: '#333'
  },

  'labelText-variant-dark': {
    color: '#000'
  },

  'labelText-variant-light': {
    color: '#fff'
  },

  containerFocused: {
    borderBottomColor: '#333'
  },

  'container-variant-dark-focus': {
    borderBottomColor: '#000'
  },

  'container-variant-light-focus': {
    borderBottomColor: '#fff'
  },

  containerTwoLines: {
    height: scale(44),
    position: 'relative',
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(151, 151, 151, 0.28)'
  },

  textInputTwoLines: {
    marginTop: scale(-5),
    fontSize: scale(14),
    lineHeight: scale(17)
  },

  textInputTwoLinesDisabled: {
    color: 'rgb(204, 204, 204)'
  },

  action: {
    alignSelf: 'center',
    paddingLeft: scale(5),
    paddingVertical: scale(5),
    marginTop: scale(-5)

  },

  actionIcon: {
    fontSize: scale(14)
  },

  error: {
    color: '#a52422',
    position: 'absolute',
    fontSize: scale(Platform.OS === 'android' ? 12 : 10),
    top: scale(Platform.OS === 'android' ? 56 : 52)
  }
})
