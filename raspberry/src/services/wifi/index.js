import template from '../../helpers/template'

import path from 'path'

import * as config from '../../../config'

import _ from 'lodash'

import fs from 'fs'
import cp from 'child_process'

const iw = require('iwlist')(config.IFFACE)

export const disconnect = async () => {
  const fileName = '/etc/wpa_supplicant/wpa_supplicant.conf'

  const file = fs.readFileSync(fileName).toString().split(/\r|\n/)
  const findNetwork = _.findIndex(file, l => _.includes(l, 'network={'))
  const findNetworkAfter = _.findIndex(file, l => _.includes(l, '}'))
  const fileEnd = (findNetwork !== -1) ? _.map(file, (d, i) => {
    if (i >= findNetwork && i <= findNetworkAfter) {
      return ''
    }
    return d
  }) : file

  const result = fileEnd.join('\n').trim()

  fs.writeFileSync(fileName, result)

  execIgnoreFail(`sudo sudo ifconfig ${config.IFFACE} down`)
  execIgnoreFail(`sudo sudo ifconfig ${config.IFFACE} up`)
}

let scanned = []

const execIgnoreFail = params => {
  try {
    cp.execSync(params)
  } catch (err) {
    console.error(err)
  }
}

const _scan = () => new Promise((resolve, reject) => {
  iw.scan((err, result) => {
    if (err) return reject(err)

    console.log('SCANNED', JSON.stringify(result))

    if (result.length > 0) {
      scanned = result.map(d => ({ ssid: d.essid, ...d }))
    }

    resolve(scanned)
  })
})

export const scan = async () => {
  if (scanned.length > 0) {
    _scan()
    return scanned
  }

  return _scan()
}

const _getValuesToConnect = (ssid, password) => {
  const file = path.join(__dirname, '../../../connection.json')
  const connectorExists = fs.existsSync(file)

  if (!ssid && !connectorExists) throw new Error('INVALID_PARAMS_TO_CONNECT')

  if (!ssid && connectorExists) {
    return JSON.parse(fs.readFileSync(file).toString())
  }

  return { ssid, password }
}

const _saveValuesToConnect = (ssid, password) => {
  const file = path.join(__dirname, '../../../connection.json')

  fs.writeFileSync(file, JSON.stringify({ ssid, password }, null, 2))
  console.log('SAVED VALUES AT', file)
}

export const connect = async (_ssid, _password) => {
  const { ssid, password } = _getValuesToConnect(_ssid, _password)

  const fileName = '/etc/wpa_supplicant/wpa_supplicant.conf'

  const file = fs.readFileSync(fileName).toString().split(/\r|\n/)
  const findNetwork = _.findIndex(file, l => _.includes(l, 'network={'))
  const findNetworkAfter = _.findIndex(file, l => _.includes(l, '}'))
  const fileEnd = (findNetwork !== -1) ? _.map(file, (d, i) => {
    if (i >= findNetwork && i <= findNetworkAfter) {
      return ''
    }
    return d
  }) : file

  const result = fileEnd.join('\n').trim() + (`

network={
    ssid=${JSON.stringify(ssid)}
    ${password ? `psk=${JSON.stringify(password)}` : ''}
}
`)

  fs.writeFileSync(fileName, result)
  _saveValuesToConnect(ssid, password)

  return { success: true }
}

export const checkIfIsConnected = async () => {
  try {
    const result = cp.execSync(`iw ${config.IFFACE} link`).toString()

    if (result.includes('Connected to')) return true
  } catch (err) {
    console.error(err)
  }

  return false
}

export const enableAccessPoint = async () => {
  console.log('ENABLING ACCESS POINT')
  const transpileDhcpcd = template(path.join(__dirname, '../../templates/dhcpcd/dhcpcd.ap.hbs'), {
    wifi_interface: config.IFFACE,
    ip_addr: config.IPADDRESS
  })

  fs.writeFileSync('/etc/dhcpcd.conf', transpileDhcpcd)

  const transpileDnsmasq = template(path.join(__dirname, '../../templates/dnsmasq/dnsmasq.ap.hbs'), {
    wifi_interface: config.IFFACE,
    subnet_range_start: config.SUBNET_RANGE_START,
    subnet_range_end: config.SUBNET_RANGE_END,
    netmask: config.NETMASK
  })

  fs.writeFileSync('/etc/dnsmasq.conf', transpileDnsmasq)

  const transpileHostapd = template(path.join(__dirname, '../../templates/hostapd/hostapd.ap.hbs'), {
    ssid: config.SSID,
    wifi_interface: config.IFFACE
  })

  fs.writeFileSync('/etc/hostapd/hostapd.conf', transpileHostapd)

  try {
    await disconnect()
  } catch (err) {}
  execIgnoreFail('sudo systemctl restart dhcpcd')
  console.log('RESTART DHCPCD')
  execIgnoreFail(`sudo sudo ifconfig ${config.IFFACE} down`)
  execIgnoreFail(`sudo sudo ifconfig ${config.IFFACE} up`)
  console.log('RESTART WLAN')
  execIgnoreFail('sudo systemctl enable hostapd')
  execIgnoreFail('sudo systemctl unmask hostapd')
  execIgnoreFail('sudo systemctl start hostapd')
  execIgnoreFail('sudo systemctl restart hostapd')
  console.log('RESTART HOSTAPD')
  execIgnoreFail('sudo systemctl restart dnsmasq')
  console.log('SUCESS')
}

export const disableAccessPoint = async () => {
  console.log('DISABLING ACCESS POINT')
  const transpileDhcpcd = template(path.join(__dirname, '../../templates/dhcpcd/dhcpcd.client.hbs'), {
    wifi_interface: config.IFFACE,
    ip_addr: config.IPADDRESS
  })

  fs.writeFileSync('/etc/dhcpcd.conf', transpileDhcpcd)

  const transpileDnsmasq = template(path.join(__dirname, '../../templates/dnsmasq/dnsmasq.client.hbs'), {
    wifi_interface: config.IFFACE,
    subnet_range_start: config.SUBNET_RANGE_START,
    subnet_range_end: config.SUBNET_RANGE_END,
    netmask: config.NETMASK
  })

  fs.writeFileSync('/etc/dnsmasq.conf', transpileDnsmasq)

  const transpileHostapd = template(path.join(__dirname, '../../templates/hostapd/hostapd.client.hbs'), {
    ssid: config.SSID,
    wifi_interface: config.IFFACE
  })

  fs.writeFileSync('/etc/hostapd/hostapd.conf', transpileHostapd)

  execIgnoreFail('sudo systemctl stop dnsmasq')
  execIgnoreFail('sudo systemctl stop hostapd')
  execIgnoreFail('sudo systemctl disable hostapd')
  execIgnoreFail('sudo systemctl restart dhcpcd')

  try {
    await connect()
  } catch (err) {
    console.error(err)
  }

  execIgnoreFail(`sudo sudo ifconfig ${config.IFFACE} down`)
  execIgnoreFail(`sudo sudo ifconfig ${config.IFFACE} up`)

  console.log('SUCESS')
}
