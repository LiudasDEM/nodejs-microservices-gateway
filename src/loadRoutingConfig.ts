import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

import yamljs from 'yamljs'

import logger from './logger'


let configuration: any = null


async function loadAndParseConfiguration(): Promise<any> {
	const fileExists = await promisify(fs.exists)(path.join(process.cwd(), '..', 'routing.conf.yaml'))

	if (!fileExists) {
		logger.error('configuration file not found, set up routing.conf.yaml file')
		process.exit(1)
	}

	const file = await promisify(fs.readFile)(path.join(process.cwd(), '..', 'routing.conf.yaml'))

	try {
		return yamljs.parse(file.toString())
	} catch (e) {
		logger.log('failed to parse routing.conf.yaml', { error: e })
	}
}


async function getConfiguration(): Promise<any> {
	if (configuration) {
		return configuration
	}

	configuration = loadAndParseConfiguration()

	return configuration
}


export default getConfiguration
