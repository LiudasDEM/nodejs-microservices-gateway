import 'dotenv/config'

import config from '../config'

import app from './app'

import logger from './logger'


import loadRoutingConfig from './loadRoutingConfig'
loadRoutingConfig()


app.listen(config.httpPort, () => {
	logger.info(`GATEWAY server listening on port ${config.httpPort}`, {})
})
