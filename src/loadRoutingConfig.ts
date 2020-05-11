import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

import yamljs from 'yamljs'

import logger from './logger'


interface IOptions {
	headers: { key: boolean };
}

interface IPath {
	url: string;
	origin: string;
	options: IOptions;
}


export interface IConfiguration {
	paths: IPath[];
	options: IOptions;
}


let configuration: Promise<IConfiguration> = null


async function loadAndParseConfiguration(): Promise<IConfiguration> {
	const confPath = path.join(process.cwd(), '..', 'routing.conf.yaml')
	logger.info(`loading configuration from ${confPath}`)

	const fileExists = await promisify(fs.exists)(confPath)

	if (!fileExists) {
		logger.error('configuration file not found, set up routing.conf.yaml file')
		process.exit(1)
	}

	const file = await promisify(fs.readFile)(confPath)

	try {
		return yamljs.parse(file.toString())
	} catch (e) {
		logger.log('failed to parse routing.conf.yaml', { error: e })
	}
}


async function getConfiguration(): Promise<IConfiguration> {
	if (configuration) {
		return configuration
	}

	configuration = loadAndParseConfiguration()

	return configuration
}


export default getConfiguration
