import express from 'express'
import wrap from 'express-async-wrap'

import loadRoutingConfig from './loadRoutingConfig'

const router = express.Router()

let configuration = loadRoutingConfig()


router.use(wrap(async function ensureConfiguration(req, res, next) {
	if (configuration.then && typeof configuration.then === 'function') {
		configuration = await configuration
	}
	next()
}))


export default router
