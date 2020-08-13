import React, { Component } from 'react'

import { TextInputMask } from 'react-native-masked-text'

import {
  TextInput as TextInputRN,
  View,
  Text,
  TouchableWithoutFeedback
} from 'react-native'

import Icon from '../icon'

import style from './style'

import isEmpty from 'lodash/isEmpty'

export const validateValueOrRequired = validation => ({ required, value, ...restProps }) => {
  const valued = String(value || '')
  if (required || isEmpty(valued) === false) {
    return validation(value, restProps)
  }
  return true
}

export default class TextInput extends Component {
  static defaultProps = {
    clear: true
  }

  state = {
    focus: false,
    active: false
  }

  focus () {
    this._refInput.focus && this._refInput.focus()
    this._refInput.getElement && this._refInput.getElement().focus()
  }

  _renderLabel () {
    const { active } = this.state
    const { placeholder, label, value, variant } = this.props

    const text = label || placeholder

    return (
      <View style={[
        style.labelContainer,
        variant && style[`labelContainer-variant-${variant}`],
      ]}>
        {(active || !!value) && !!text && <Text style={[style.labelText, variant && style[`labelText-variant-${variant}`]]}>{text}</Text>}
      </View>
    )
  }

  _toggleViewText = () => {

  }

  // _renderAfterTextInput () {
  //   const { active } = this.state
  //   const { clear, secureTextEntry } = this.props

  //   return  clear && active && (
  //     <TouchableWithoutFeedback onPress={secureTextEntry ? this._toggleViewText : () => this._onChangeText('')}>
  //       <View style={style.action}>
  //         <Icon name={secureTextEntry ? 'eye' : 'close'} style={style.actionIcon} />
  //       </View>
  //     </TouchableWithoutFeedback>
  //   )
  // }

  _renderError () {
    const { error } = this.props

    return (
      <Text style={style.error}>{error}</Text>
    )
  }

  _onChangeText = value => {
    const { onChangeText } = this.props

    this.setState({ active: !!value })

    onChangeText && onChangeText(value)
  }

  render () {
    const { focus } = this.state
    const { variant, mask, error, onFocus, onBlur, size, disabled, styleTextInput, ...restProps } = this.props

    const Component = mask ? TextInputMask : TextInputRN

    return (
      <View style={{ position:  'relative' }}>
        <View style={[
          style.container,
          variant && style[`container-variant-${variant}`],
          focus && style.containerFocused,
          focus && variant && style[`container-variant-${variant}-focus`],
        ]}>
          {this._renderLabel()}
          <Component
            {...(mask && {
              type: 'custom',
              options: { mask }
            })}
            onFocus={e => {
              this.setState({ focus: true })
              onFocus && onFocus(e)
            }}
            onBlur={e => {
              this.setState({ focus: false })
              onBlur && onBlur(e)
            }}
            editable={!disabled}
            selectionColor={variant ? '#fff' : '#333'}
            placeholderTextColor={variant ? '#fff' : '#333'}
            {...restProps}
            scrollEnabled={false}
            onChangeText={this._onChangeText}
            ref={ref => (this._refInput = ref)}
            style={[
              style.textInput,
              variant && style[`textInput-variant-${variant}`],
              size && style[`textInput-${size}`],
              styleTextInput
            ]}
          />
        </View>
        {error && this._renderError()}
      </View>
    )
  }
}
