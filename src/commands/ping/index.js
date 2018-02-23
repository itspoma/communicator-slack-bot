const { emit, EVENT } = require('../../modules/events');
const emojis = require('../../providers/slack/emojis');

const run = (text, from, commands) => {
  const response = JSON.stringify(commands);

  emit(EVENT.SEND_MESSAGE, response, from, (message) => {
    emit(EVENT.SEND_REACTION, emojis.HEAVY_PLUS_SIGN, { channel: message.channel, ts: message.ts });
    emit(EVENT.SEND_REACTION, emojis.HEAVY_MINUS_SIGN, { channel: message.channel, ts: message.ts });
  });
};

module.exports = { run };
