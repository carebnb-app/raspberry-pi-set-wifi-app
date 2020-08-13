import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  View,
  Keyboard,
  Platform
} from 'react-native'

import Style from './style'

import { View as ViewRNA } from 'react-native-animatable'


/**
 * With background you can set the default background in your Component or Container
 */
export default class KeyboardAwareness extends Component {
  static propTypes = {
    /**
     * This is the distance between the top of the user screen
     * and the react native view, may be non-zero in some use cases.
    */
    keyboardVerticalOffset: PropTypes.number,
    /**
     * Enable or disable Keyboard Awareness,
     * good when you have input or button inside a
     * view in the bottom of the screen
    */
    enabledKeyboardAwareness: PropTypes.bool,
    children: PropTypes.any
  }

  static defaultProps = {
    keyboardVerticalOffset: 0,
    enabledKeyboardAwareness: Platform.OS === 'ios'
  }

  constructor (props) {
    super(props)
    this.state = { height: 0 }
  }

  componentWillMount () {
    this._keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this._keyboardDidShow)
    this._keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
    this._keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)
    this._keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this._keyboardDidHide)
  }

  componentWillUnmount () {
    this._keyboardWillShowSub && this._keyboardWillShowSub.remove()
    this._keyboardDidShowSub && this._keyboardDidShowSub.remove()
    this._keyboardDidHideSub && this._keyboardDidHideSub.remove()
    this._keyboardWillHideSub && this._keyboardWillHideSub.remove()
  }

  _keyboardDidShow = ({ endCoordinates }) => {
    this.setState({
      height: endCoordinates.height
    })
  }

  _keyboardDidHide = () => {
    this.setState({ height: 0 })
  }

  render () {
    const {
      children,
      keyboardVerticalOffset,
      enabledKeyboardAwareness
    } = this.props

    return (
      <React.Fragment>
        <View style={Style.default}>
          {children}
        </View>
        {enabledKeyboardAwareness && <ViewRNA
          duration={150}
          easing='ease-in-out'
          transition='height'
          style={{ height: this.state.height + keyboardVerticalOffset  }}
        />}
      </React.Fragment>
    )
  }
}
