module.exports = {
	KEYWORDS: {
		ROUTE: '__routes__',
		BEFORE_FILTER: '__befores__',
		AFTER_FILTER: '__afters__',
		SERVER_MAP: '__serverMap__'
	}, RESERVED: {
		AFTER_START: 'afterStart',
		START: 'start',
		STARTID: 'startId',
		CURRENT_SERVER: 'curServer',
		MAIN: 'main',
		MASTER: 'master',
		ENV: 'env',
		ENV_DEV: 'development',
		ENV_PRO: 'production',
		BASE: 'base',
		SERVERS: 'servers',
		CLUSTER_COUNT: 'clusterCount',
		SERVER_TYPE: 'serverType',
		SERVER_ID: 'serverId',
		CLUSTER: 'clusters',
		MODE: 'mode',
		ALL: 'all',
		TYPE: 'type'
	}, FILEPATH: {
		MASTER: '/config/master.json',
		SERVER: '/config/servers.json',
		CONFIG_DIR: '/config',
		SERVER_DIR: '/app/servers/',
		LIFECYCLE: '/lifecycle.js'
	}
};
