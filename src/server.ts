import 'dotenv/config'

import config from '../config'

import app from './app'

app.listen(config.httpPort, () => {
  console.info(`GATEWAY server listening on port ${config.httpPort}`)
})
