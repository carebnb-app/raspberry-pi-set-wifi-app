import { createReducer } from 'redux-act'

import { setStatus } from './actions'

const initialState = {
  status: 'pending'
}

export default createReducer({
  [setStatus]: (state, status) => ({
    ...state,
    status
  })
}, { ...initialState })
