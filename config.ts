export default {
	httpPort: process.env.HTTP_PORT || 7070,
	logger: {
		index: process.env.ELASTIC_STACK_INDEX,
		logstashHost: process.env.ELASTIC_STACK_LOGSTASH_HOST,
		environment: process.env.ELASTIC_STACK_ENVIRONMENT,
	},
}
