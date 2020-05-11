import express, { Request, Response, NextFunction } from 'express'

import logger from './logger'

const app = express()


app.use((req, res, next) => {
	next(new Error('NotFound'))
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	if (err.message === 'Unauthorized') {
		res.sendStatus(401)
		return
	}

	if (err.message === 'NotFound') {
		res.sendStatus(404)
		return
	}

	logger.error(err.message, { error: err, req })

	if (err.message === 'Bad Gateway') {
		res.sendStatus(502)
		return
	}

	if (err.message === 'Service Unavailable') {
		res.sendStatus(502)
		return
	}

	if (err.message === 'Gateway Timeout') {
		res.sendStatus(504)
		return
	}

	res.sendStatus(500)
})


export default app