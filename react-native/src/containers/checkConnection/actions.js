import { createAction } from 'redux-act'

import * as api from '../../api'

export const setStatus = createAction('SET_CHECK_CONNECTION_STATUS')
export const checkConnection = createAction('GET_WIFI_STATUS', api.checkConnection)
export const disableAccessPoint = createAction('DISABLE_ACCESS_POINT', api.disableAccessPoint)