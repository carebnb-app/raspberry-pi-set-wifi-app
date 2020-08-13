import includes from 'lodash/includes'

export const fulfilled = str => `${str}_FULFILLED`
export const rejected = str => `${str}_REJECTED`
export const pending = str => `${str}_PENDING`

const initialState = {
  GLOBAL: false
}

export function reducer (state = initialState, action) {
  const stateSend = {
    ...state
  }

  if (includes(action.type, '_FULFILLED') || includes(action.type, '_REJECTED')) {
    stateSend[action.type.replace('_FULFILLED', '').replace('_REJECTED', '')] = false
  } else if (includes(action.type, '_PENDING')) {
    stateSend[action.type.replace('_PENDING', '')] = true
  }

  const GLOBAL = Object.keys(stateSend).reduce((last, key) => {
    if (stateSend[key] && key !== 'GLOBAL') return true
    return last
  }, false)

  stateSend.GLOBAL = GLOBAL

  return stateSend
}
