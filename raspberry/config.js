import dotenv from 'dotenv'

dotenv.config()

export const PROJECT_NAME = process.env.PROJECT_NAME || 'Carebnb'

export const API_URL = process.env.API_URL || 'http://localhost:3500'
export const API_PORT = process.env.API_PORT || '3500'

export const SESSION_KEY = process.env.SESSION_KEY || '339Mdea2MxaJj5AZAuJcrpIfqlzzBGFd246E7AEE74F69F1E'

export const NODE_ENV = process.env.NODE_ENV || 'development'
export const ENVIRONMENT = NODE_ENV
export const JWT_KEY = process.env.JWT_KEY || 'JD8Gzr5h1k3322Zi1632hOG20nOyczHdRCOxYyZ2gmZZNcK7BufFu4InylIzrv'

export const IFFACE = process.env.IFFACE || 'wlan0'
export const SSID = process.env.SSID || 'Carebnb Device'
export const IPADDRESS = process.env.IPADDRESS || '192.168.88.1'
export const SUBNET_RANGE_START = process.env.SUBNET_RANGE_START || '192.168.88.100'
export const SUBNET_RANGE_END = process.env.SUBNET_RANGE_END || '192.168.88.200'
export const NETMASK = process.env.NETMASK || '255.255.255.0'
export const FORCE_ACCESSPOINT = process.env.FORCE_ACCESSPOINT || '1'
