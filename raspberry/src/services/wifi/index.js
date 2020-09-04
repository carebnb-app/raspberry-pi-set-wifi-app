import template from '../../helpers/template'

import path from 'path'

import * as config from '../../../config'

import _ from 'lodash'

import fs from 'fs'
import cp from 'child_process'

import { sleep } from '../../helpers/sleep'

const iw = require('iwlist')(config.IFFACE)

export const disconnect = async () => {
  execIgnoreFail(`sudo wpa_cli -i ${config.IFFACE_CLIENT} DISCONNECT`)
}

let scanned = []

const execIgnoreFail = params => {
  try {
    return cp.execSync(params)
  } catch (err) {
    console.error(err)
  }

  return null
}

execIgnoreFail('sudo systemctl stop hostapd')
execIgnoreFail(`sudo iw dev ${config.IFFACE_CLIENT} interface add ${config.IFFACE} type __ap`)

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

export const checkIfIsConnected = () => {
  const exec = String(execIgnoreFail(`iw ${config.IFFACE_CLIENT} link`) || 'Not connected')
  return exec.includes('Not connected') === false
}

export const connect = async (ssid, password, countryCode = config.COUNTRY) => {
  if (!ssid) {
    if (checkIfIsConnected() === false) throw new Error('COULD_NOT_CONNECT')

    return { success: true }
  }

  const fileName = '/etc/wpa_supplicant/wpa_supplicant.conf'

  const file = fs.readFileSync(fileName).toString().split(/\r|\n/)
  const findNetwork = _.findIndex(file, l => _.includes(l, 'network={'))
  const findCountry = _.findIndex(file, l => _.includes(l, 'country='))
  const findNetworkAfter = _.findIndex(file, l => _.includes(l, '}'))
  const fileEnd = (findNetwork !== -1) ? _.map(file, (d, i) => {
    if (i === findCountry) return ''
    if (i >= findNetwork && i <= findNetworkAfter) {
      return ''
    }
    return d
  }) : file

  const result = fileEnd.join('\n').trim() + (`

country=${countryCode}

network={
    ssid=${JSON.stringify(ssid)}
    ${password ? `psk=${JSON.stringify(password)}` : ''}
}
`)

  fs.writeFileSync(fileName, result)

  console.log('SETTED AT', fileName)

  for (let i = 0; i < 3; i++) {
    console.log('RETRYING CONNECTING')
    execIgnoreFail(`sudo killall wpa_supplicant`)
    execIgnoreFail(`sudo wpa_supplicant -B -i${config.IFFACE_CLIENT} -c /etc/wpa_supplicant/wpa_supplicant.conf`)

    await sleep(5000)
    if (checkIfIsConnected() === false) execIgnoreFail(`sudo wpa_cli -i${config.IFFACE_CLIENT} RECONFIGURE`)
    await sleep(5000)
    if (checkIfIsConnected()) break
  }

  execIgnoreFail(`sudo ifconfig ${config.IFFACE_CLIENT} up`)

  if (checkIfIsConnected() === false) throw new Error('COULD_NOT_CONNECT')

  return { success: true }
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

  console.log('RESTART DHCPCD')
  execIgnoreFail('sudo systemctl restart dhcpcd')
  console.log('RESTART HOSTAPD')
  execIgnoreFail('sudo systemctl enable hostapd')
  execIgnoreFail('sudo systemctl unmask hostapd')
  execIgnoreFail('sudo systemctl start hostapd')
  execIgnoreFail('sudo systemctl restart hostapd')
  console.log('RESTART DNSMASQ')
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
}
