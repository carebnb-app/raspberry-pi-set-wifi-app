
import template from '../../helpers/template'
import path from 'path'
import * as config from '../../../config'
import _ from 'lodash'
import fs from 'fs'
import cp from 'child_process'
import Journalctl from 'journalctl'
import EventEmitter from 'events'
import Hashmap from 'hashmap'

const iw = require('iwlist')(config.IFFACE)

// Emitter for commands when finished
const eventEmitter = new EventEmitter()

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
journalctl.on('event', (event) => {
  if( event.MESSAGE === 'pam_unix(sudo:session): session closed for user root' ){
    if(!conclusionMessages.search(event._CMDLINE)){
      eventEmitter.emit('command-finished ' + event._CMDLINE)
    }
  } else if(conclusionMessages.has(event.MESSAGE)){
    eventEmitter.emit('command-finished ' + conclusionMessages.get(event.MESSAGE))
  }
})

// Execute long running operations and wait for stdout on journalctl
// This gives feedback to commands without output
const conclusionMessages = new Hashmap()
const execWithJournalctlCallback = (command, callback, conclusionMessage = null) => {
  if(conclusionMessage !== null){
    conclusionMessages.set(conclusionMessage, command)
  }
  eventEmitter.once('command-finished ' + command, callback)
  cp.exec(command)
}

// Eecute ssh commands without taking any caution
// Inputs and results are unexpected
const execIgnoreFail = params => {
  try {
    return cp.execSync(params)
  } catch (err) {
    console.error(err)
  }
  return null
}

// Holds scanned networks SSIDs
const scanned = []
const _scan = () => new Promise((resolve, reject) => {
  iw.scan((err, result) => {
    if (err) return reject(err)
    console.log('Scanned', JSON.stringify(result))
    if (result.length > 0) {
      scanned = result.map(d => ({ ssid: d.essid, ...d }))
    }
    resolve(scanned)
  })
})

/**
 * Scan for networks
 * 
 * @returns {Array}
 */
export const scan = async () => {
  if (scanned.length > 0) {
    _scan()
    return scanned
  }
  return _scan()
}

/**
 * Check if it is connected to a wifi network
 * 
 * @returns {boolean}
 */
export const checkIfIsConnected = () => {
  const exec = String(execIgnoreFail(`iw ${config.IFFACE_CLIENT} link`) || 'Not connected')
  return exec.includes('Not connected') === false
}

/**
 * Try to connect on a wifi network
 * 
 * @param {String} ssid 
 * @param {String} password 
 * @param {String} countryCode 
 * 
 * @returns {boolean}
 */
export const connect = async (ssid, password, countryCode = config.COUNTRY) => {
  // Write a wpa_suppplicant.conf file and save it
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

  // Restart network drivers
  execWithJournalctlCallback(`sudo killall wpa_supplicant`, () => {
    execWithJournalctlCallback(`sudo wpa_supplicant -B -i${config.IFFACE_CLIENT} -c /etc/wpa_supplicant/wpa_supplicant.conf`, () => {
      if(!checkIfIsConnected()){
        // Retry
        execWithJournalctlCallback(`sudo wpa_cli -i${config.IFFACE_CLIENT} RECONFIGURE`, () => {
          execWithJournalctlCallback(`sudo ifconfig ${config.IFFACE_CLIENT} up`, () => {
            return checkIfIsConnected()
          })
        })
      }
      else{
        return true
      }
    })
  })
}

/**
 * Disconnect from wifi.
 * No questions asked.
 */
export const disconnect = async () => {
  execIgnoreFail(`sudo wpa_cli -i ${config.IFFACE_CLIENT} DISCONNECT`)
}

/**
 * Enable eccess point and call "callback" when it is done.
 * 
 * It won't check if each command went well or not.
 * I really doesn't matter, as in and out states can vary a lot.
 * 
 * @param {Function} callback 
 */
export const enableAccessPoint = (callback) => {
  console.log('Enabling access point')
  writeAccessPointFiles('ap')
  execWithJournalctlCallback(`sudo iw dev ${config.IFFACE} del`, () => {
    execWithJournalctlCallback(`sudo iw dev ${config.IFFACE_CLIENT} interface add ${config.IFFACE} type __ap`, () => {
      execWithJournalctlCallback('sudo systemctl start dhcpcd', () => {
        execWithJournalctlCallback('sudo systemctl enable hostapd', () => {
          execWithJournalctlCallback('sudo systemctl unmask hostapd', () => {
            execWithJournalctlCallback('sudo systemctl start hostapd', () => {
              execWithJournalctlCallback('sudo systemctl start dnsmasq', () => {
                callback()
              })
            })
          })
        })
      })
    }, 'Interface uap0.IPv6 no longer relevant for mDNS')
  }, 'uap0: removing interface')
}

/**
 * Disable eccess point and call "callback" when it is done.
 * 
 * It won't check if each command went well or not.
 * I really doesn't matter, as in and out states can vary a lot.
 * 
 * @param {Function} callback 
 */
export const disableAccessPoint = (callback) => {
  console.log('Disabling access point')
  writeAccessPointFiles('client')
  execWithJournalctlCallback('sudo systemctl stop dnsmasq', () => {
    execWithJournalctlCallback('sudo systemctl stop hostapd', () => {
      execWithJournalctlCallback('sudo systemctl disable hostapd', () => {
        execWithJournalctlCallback(`sudo iw dev ${config.IFFACE} del`, () => {
          execWithJournalctlCallback('sudo systemctl restart dhcpd', () => {
            callback()
          })
        }, 'uap0: removing interface')
      })
    })
  })
}

/**
 * Aux method, write access point files from templates
 * Used by disableAccessPoint and enableAccesPoint
 * 
 * @param {String} type 
 */
const writeAccessPointFiles = (type) => {
  const transpileDhcpcd = template(path.join(__dirname, `../../templates/dhcpcd/dhcpcd.${type}.hbs`), {
    wifi_interface: config.IFFACE,
    ip_addr: config.IPADDRESS
  })
  fs.writeFileSync('/etc/dhcpcd.conf', transpileDhcpcd)

  const transpileDnsmasq = template(path.join(__dirname, `../../templates/dnsmasq/dnsmasq.${type}.hbs`), {
    wifi_interface: config.IFFACE,
    subnet_range_start: config.SUBNET_RANGE_START,
    subnet_range_end: config.SUBNET_RANGE_END,
    netmask: config.NETMASK
  })
  fs.writeFileSync('/etc/dnsmasq.conf', transpileDnsmasq)

  const transpileHostapd = template(path.join(__dirname, `../../templates/hostapd/hostapd.${type}.hbs`), {
    ssid: config.SSID,
    wifi_interface: config.IFFACE
  })
  fs.writeFileSync('/etc/hostapd/hostapd.conf', transpileHostapd)
}