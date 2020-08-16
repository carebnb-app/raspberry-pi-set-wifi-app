import React, { Component } from 'react'

import TextInput from '../textInput'

import Touchable from '../touchable'
import TouchableWithHilightedText from '../touchableWithHilightedText'
import KeyboardAwareness from '../keyboardAwareness'

import { Modal, View, SafeAreaView, ScrollView } from 'react-native'

import removeAccents from 'remove-accents'
import sortByTerm from '../../helpers/sortByTerm'
import filter from 'lodash/filter'
import includes from 'lodash/includes'

import Icon from '../icon'

import style from './style'

import uuid from 'uuid'

export default class Selector extends Component {
  state = {
    loadedOptions: [],
    isModalOpen: false,
    isActive: false,
    search: ''
  }

  _uuid = uuid()

  componentDidMount () {
    const { loadOptions } = this.props
    if (loadOptions) {
      this._loadOptions(loadOptions)
    }
  }

  _renderModal = () => {
    const filtered = this.filtering()

    return (
      <Modal
        visible
        animated
        animationType='slide'
      >
      <KeyboardAwareness>
        <SafeAreaView>
          <View style={style.modalContainer}>
            <View style={style.close}>
              <Touchable onPress={this.toggle}>
                <Icon name='close-a' size={20} />
              </Touchable>
            </View>
            <View style={style.search}>
              <TextInput
                placeholder='Procurar'
                value={this.state.search}
                onChangeText={this._set}
                selectTextOnFocus
                autoFocus
                onFocus={() => this.setState({ isActive: true })}
                onBlur={() => this.setState({ isActive: false })}
              />
            </View>
            <ScrollView
              keyboardShouldPersistTaps='always'
            >
              {filtered.map(d => (
                <TouchableWithHilightedText
                  key={`${this._uuid}-${d.value}`}
                  hilight={this.state.search}
                  onPress={() => this._select(d)}
                >
                  {d.name}
                </TouchableWithHilightedText>
              ))}
            </ScrollView>
          </View>
        </SafeAreaView>
      </KeyboardAwareness>
      </Modal>
    )
  }

  _select = obj => {
    const { onChangeText } = this.props
    this.setState({ isModalOpen: false })
    onChangeText && onChangeText(obj.value)
  }

  _options = () => {
    const { loadOptions, options } = this.props
    return loadOptions ? this.state.loadedOptions : options
  }

  filtering = () => {
    const { search } = this.state

    const options = this._options()

    if (!search) return this._options()

    const filtered = filter(
      options,
      d => includes(removeAccents(String(d.name || '').toLowerCase()), removeAccents(String(search).toLowerCase()))
    )

    return sortByTerm(filtered, 'name', search)
  }

  _set = search => this.setState({ search })

  toggle = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen })
  }

  _loadOptions = async loadOptions => {
    const values = await loadOptions()

    this.setState({ loadedOptions: values })
  }

  render () {
    const {
      placeholder,
      label,
      disabled,
      value: _value
    } = this.props

    const value = this._options().find(d => d.value === _value)

    const Component = disabled ? View : Touchable
    return (
      <React.Fragment>
        <Component onPress={this.toggle} style={disabled && { opacity: 0.6 }}>
          <View style={{ position: 'relative' }}>
            <TextInput
              label={label}
              placeholder={placeholder}
              disabled
              value={value ? value.name : void (0)}
            />
            <View style={{ zIndex: 100, position: 'absolute', top: 0, width: '100%', height: '100%' }} />
          </View>
        </Component>
        {this.state.isModalOpen && this._renderModal()}
      </React.Fragment>
    )
  }
}
