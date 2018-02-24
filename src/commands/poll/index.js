const { events, EVENT } = require('../../modules/events');
const emojis = require('../../providers/slack/emojis');
const web = require('../../providers/slack/web');

const cache = require('../../modules/cache').client;

const create = (text, from, message) => {
  const votes = text.match(/:(.+?):/g);

  votes.forEach(vote => {
    const emojiName = vote.substr(1, vote.length - 2);
    console.log('emojiName', emojiName);

    events.emit(EVENT.SEND_REACTION, emojiName, { channel: message.channel, ts: message.ts });
  });

  // events.emit(EVENT.SEND_REACTION, emojis.THUMBSDOWN, { channel: message.channel, ts: message.ts });

  const poll = JSON.stringify({ from, message });
  cache.sadd("poll", poll);
}

const stop = (text, from, message) => {
  cache.smembers("poll", (error, members) => {
    const member = members.find(member => {
      try {
        return JSON.parse(member).from.user.id == from.user.id;
      }
      catch (e) { }

      return false;
    });

    const poll = JSON.parse(member);

    cache.srem("poll", member);

    web.getReactions({channel: poll.message.channel, ts: poll.message.ts})
      .then(reactions => {
        console.log('reactions', reactions);

        const text = reactions.reduce((accum, curr) => {
          return accum + ` (:${curr.name}: = ${curr.count}) `;
        }, '');

        events.emit(EVENT.SEND_MESSAGE, text, from);
      })
      .catch(console.error)
  });
}

const run = (text, from, commands) => {
  const response = JSON.stringify(commands);

  events.emit(EVENT.SEND_MESSAGE, response, from, (message) => {
    if (text.indexOf('create') !== -1) {
      return create(text, from, message);
    }

    if (text.indexOf('stop') !== -1) {
      return stop(text, from, message);
    }
  });
};

module.exports = { run };
