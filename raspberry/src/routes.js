
import connect from './helpers/connect'

import * as Wifi from './controllers/wifi'
import * as Status from './controllers/status'

export default function routes (router) {
  router.get('/wifi/list', connect(Wifi.list))
  router.get('/status', connect(Status.all))
  router.post('/wifi/connect', connect(Wifi.connect))
}
