require('./_globalHooks');

const httpConfig = require('./support/httpConfig');
const eventstore = require('../index.js');
const assert = require('assert');

describe('Http Client - Ping', () => {
    it('Should return successful when OK', () => {
        const client = eventstore.http(httpConfig);

        return client.ping().catch(err => {
            assert.fail(err.message);
        });
    });

    it('Should fail when not OK', function() {
        this.timeout(30000);
        const config = JSON.parse(JSON.stringify(httpConfig));
        config.hostname = 'MadeToFailHostName';

        const client = eventstore.http(config);

        return client.ping().then(() => {
            assert.fail('Should not succeed');
        }).catch(err => {
            assert(err.message);
        });
    });
});
