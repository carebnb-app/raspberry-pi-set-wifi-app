import * as api from '../../api'

import { createAction } from 'redux-act'

export const getStatus = createAction('GET_STATUS', api.status)
export const getNetworks = createAction('GET_NETWORKS', api.networks)
export const connect = createAction('CONNECT_NETWORK', api.connect)
