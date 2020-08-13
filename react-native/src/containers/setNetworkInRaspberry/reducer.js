import { createReducer } from 'redux-act'

import { getStatus, getNetworks } from './actions'

import { fulfilled, rejected, pending } from '../../helpers/reducerPromiseHelper'

const initialState = {
  status: 'pending',
  networks: []
}

export default createReducer({
  [fulfilled(getNetworks)]: (state, payload) => ({
    ...state,
    networks: payload.data
  }),

  [fulfilled(getStatus)]: (state, payload) => ({
    ...state,
    status: payload.data.type ? 'success' : 'failed'
  }),

  [rejected(getStatus)]: (state) => ({
    ...state,
    status: 'failed'
  }),

  [pending(getStatus)]: (state) => ({
    ...state,
    status: 'pending'
  })
}, { ...initialState })
