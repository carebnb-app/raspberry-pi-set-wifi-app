import * as config from '../../../config'

import * as services from '../../../services'

export const all = async () => {
  const autoConnect = services.get('autoConnect')
  if (autoConnect) clearTimeout(autoConnect)

  return {
    type: config.PROJECT_NAME
  }
}
