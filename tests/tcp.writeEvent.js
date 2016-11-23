var globalHooks = require('./_globalHooks');

var tcpConfig = require('./support/tcpConfig');
var assert = require('assert');
var eventstore = require('../index.js');
var uuid = require('uuid');

describe('TCP Client - Write Event', function() {
    it('Write to a new stream and read the event', function() {
        var client = eventstore.tcp(tcpConfig);

        var testStream = 'TestStream-' + uuid.v4();
        return client.writeEvent(testStream, 'TestEventType', {
            something: '123'
        }).then(function() {
            return client.getEvents(testStream).then(function(events) {
                assert.equal(events[0].data.something, '123');
            });
        });
    });

    it('Should fail promise if no event data provided', function() {
        var client = eventstore.tcp(tcpConfig);

        var testStream = 'TestStream-' + uuid.v4();
        return client.writeEvent(testStream, 'TestEventType'
            ).then(function() {
            assert.fail('write should not have succeeded');
        }).catch(function(err) {
            assert(err,'error should have been returned');
        });
    });
});