import connectionManager from './connectionManager';
import mapEvents from './utilities/mapEvents';
import debugModule from 'debug';
import assert from 'assert';

const debug = debugModule('geteventstore:getevents');
const baseErr = 'Get Events - ';

export default (config) => async (streamName, startPosition, length, direction, resolveLinkTos) => {
	assert(streamName, `${baseErr}Stream Name not provided`);

	direction = direction || 'forward';
	startPosition = startPosition === undefined && direction === 'backward' ? -1 : startPosition || 0;
	length = length || 1000;
	resolveLinkTos = resolveLinkTos === undefined ? true : resolveLinkTos;

	if (length > 4096) {
		console.warn('WARNING: Max event return limit exceeded. Using the max of 4096');
		length = 4096;
	}

	const connection = await connectionManager.create(config);

	function handleResult(result) {
		debug('', 'Result: %j', result);
		if (result.error) throw new Error(result.error);
		return mapEvents(result.events);
	}

	try {
		if (direction === 'forward') return await connection.readStreamEventsForward(streamName, startPosition, length, resolveLinkTos, config.credentials).then(handleResult);
		return await connection.readStreamEventsBackward(streamName, startPosition, length, resolveLinkTos, config.credentials).then(handleResult);
	} catch (err) {
		throw err;
	} finally {
		connection.releaseConnection();
	}
};