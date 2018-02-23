const { events, EVENT } = require('../../modules/events');
const emojis = require('../../providers/slack/emojis');
const web = require('../../providers/slack/web');

const cache = require('../../modules/cache').client;

const run = (text, from, commands) => {
  const response = JSON.stringify(commands);

  events.emit(EVENT.SEND_MESSAGE, response, from, (message) => {
    if (text.indexOf('create') !== -1) {
      cache.sadd("poll", JSON.stringify({ from, message }));
    }

    if (text.indexOf('stop') !== -1) {
      cache.smembers("poll", (error, members) => {
        // console.log('members', members);

        let member = members.find((member) => {
          const item = JSON.parse(member);
          return item.from.user.id == from.user.id;
        });

        cache.srem("poll", member);

        member = JSON.parse(member);

        web.getReactions({channel: member.message.channel, ts: member.message.ts})
          .then((reactions) => {
            console.log('reactions', reactions);

            const m = reactions.reduce((accum, curr) => {
              return accum + ` (:${curr.name}: = ${curr.count}) `;
            }, '');

            events.emit(EVENT.SEND_MESSAGE, m, from);
          })
          .catch(console.error)
      });
    }

    events.emit(EVENT.SEND_REACTION, emojis.THUMBSUP, { channel: message.channel, ts: message.ts });
    events.emit(EVENT.SEND_REACTION, emojis.THUMBSDOWN, { channel: message.channel, ts: message.ts });
  });
};

module.exports = { run };
