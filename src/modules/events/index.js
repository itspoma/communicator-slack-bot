const EVENT_TYPE = require('./types');

// https://nodejs.org/api/events.html
const EventEmitter = require('events');

const emitter = new EventEmitter();

const configure = () => {
  emitter.on(EVENT_TYPE.MESSAGE, require('./onmessage'))
  emitter.on(EVENT_TYPE.CONNECTED, require('./onconnected'))
}

module.exports = {
  configure,
  events: emitter,
  emit: emitter.emit,
  on: emitter.on,
  EVENT: EVENT_TYPE,
};
