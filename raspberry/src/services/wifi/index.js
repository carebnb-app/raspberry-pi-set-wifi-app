
import template from '../../helpers/template'
import path from 'path'
import * as config from '../../../config'
import _ from 'lodash'
import fs from 'fs'
import cp from 'child_process'
import { sleep } from '../../helpers/sleep'
import Journalctl from 'journalctl'
import EventEmitter from 'events'

const iw = require('iwlist')(config.IFFACE)

// Read output from journalctl and emit events
const now = new Date()
const nowStr =
  now.getFullYear() + "-" +
  ("00" + (now.getMonth() + 1)).slice(-2) + "-" +
  ("00" + now.getDate()).slice(-2) + " " +
  ("00" + now.getHours()).slice(-2) + ":" +
  ("00" + now.getMinutes()).slice(-2) + ":" +
  ("00" + now.getSeconds()).slice(-2);
const journalctl = new Journalctl({
  since: nowStr
})
const eventEmitter = new EventEmitter()
journalctl.on('event', (event) => {
  if( event.MESSAGE === 'pam_unix(sudo:session): session closed for user root' ){
    eventEmitter.emit('command-finished ' + event._CMDLINE)
  }
})

// Execute long running operations and wait for stdout on journalctl
// This gives feedback to commands without output
const execWithJournalctlCallback = (command, callback) => {
  cp.exec(command)
  eventEmitter.once('command-finished ' + command, callback)
}

export const disconnect = async () => {
  execIgnoreFail(`sudo wpa_cli -i ${config.IFFACE_CLIENT} DISCONNECT`)
}

const scanned = []

const execIgnoreFail = params => {
  try {
    return cp.execSync(params)
  } catch (err) {
    console.error(err)
  }

  return null
}

// @TODO understand why this is here
//execIgnoreFail('sudo systemctl stop hostapd')
//execIgnoreFail(`sudo iw dev ${config.IFFACE_CLIENT} interface add ${config.IFFACE} type __ap`)

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

  // @TODO move this logic to callback logic instead of sleep
  execIgnoreFail(`sudo killall wpa_supplicant`)
  execIgnoreFail(`sudo wpa_supplicant -B -i${config.IFFACE_CLIENT} -c /etc/wpa_supplicant/wpa_supplicant.conf`)
  await sleep(5000)
  if (checkIfIsConnected() === false)  execIgnoreFail(`sudo wpa_cli -i${config.IFFACE_CLIENT} RECONFIGURE`)
  await sleep(5000)
  execIgnoreFail(`sudo ifconfig ${config.IFFACE_CLIENT} up`)
  if (checkIfIsConnected() === false) throw new Error('COULD_NOT_CONNECT')

  return { success: true }
}

export const enableAccessPoint = async (callback) => {
  console.log('Enabling access point')

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

  execWithJournalctlCallback('sudo systemctl restart dhcpcd', () => {
    execWithJournalctlCallback('sudo systemctl enable hostapd', () => {
      execWithJournalctlCallback('sudo systemctl unmask hostapd', () => {
        execWithJournalctlCallback('sudo systemctl restart hostapd', () => {
          execWithJournalctlCallback('sudo systemctl restart dnsmasq', () => {
            callback()
          })
        })
      })
    })
  })
}

export const disableAccessPoint = (callback) => {
  console.log('Disabling access point')

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

  execWithJournalctlCallback('sudo systemctl stop dnsmasq', () => {
    execWithJournalctlCallback('sudo systemctl stop hostapd', () => {
      execWithJournalctlCallback('sudo systemctl disable hostapd', () => {
        execWithJournalctlCallback('sudo systemctl restart dhcpd', () => {
          callback()
        })
      })
    })
  })
}
