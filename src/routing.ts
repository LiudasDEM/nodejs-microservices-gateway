import express from 'express'
import wrap from 'express-async-wrap'
import request from 'request'

import loadRoutingConfig, { IConfiguration, IOptions } from './loadRoutingConfig'
import logger from './logger'

const router = express.Router()


const configurationPromise: Promise<IConfiguration> = loadRoutingConfig()
let configuration: IConfiguration = null


function removeHeaders(requestOrResponse: any, headers: IOptions['headers']): void {
	for (const header of headers) {
		delete requestOrResponse.headers[header.title]
	}
}


router.use(wrap(async function ensureConfiguration(req, res, next) {
	if (configurationPromise.then && typeof configurationPromise.then === 'function') {
		configuration = await configurationPromise

		configuration.paths = configuration.paths
			.sort((a, b) =>
				a.url > b.url ? 1 : -1)
	}
	next()
}))


router.use(wrap(async function plugTimeoutErrorHandler(req, res, next) {
	function onTimeoutError(err: Error): void {
		err.message = 'Gateway Timeout'

		if (!res.headersSent) {
			next(err)
		} else {
			logger.error(err.message, { error: err })
		}
	}

	req.on('error', onTimeoutError)
	res.on('error', onTimeoutError)

	req.onTimeoutError = onTimeoutError

	next()
}))


router.use(wrap(async function routeToService(req, res) {
	const endpoint = configuration.paths.find(path => req.url.startsWith(path.url))

	if (!endpoint) {
		throw new Error('NotFound')
	}

	const options = {
		url: `${endpoint.origin}${endpoint.url}`,
	}

	const headersToRemove = endpoint.options.headers.filter(({ remove }) => remove)
	removeHeaders(req, headersToRemove)

	const requestStream = request(options)
		.on('error', req.onTimeoutError)
		.on('response', response => {
			removeHeaders(response, headersToRemove)
		})

	req.pipe(requestStream).pipe(res)
}))


export default router
