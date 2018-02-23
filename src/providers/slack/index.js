const { events, EVENT } = require('../../modules/events');
const emojis = require('./emojis');
const web = require('./web');

const { RtmClient,
        CLIENT_EVENTS,
        RTM_EVENTS, RTM_MESSAGE_SUBTYPES } = require('@slack/client');

const token = process.env.SLACK_BOT_OAUTH_TOKEN;

const rtm = new RtmClient(token, {
  logLevel: 'error',
  dataStore: false,
  useRtmConnect: true,
});

web.configure();

rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  console.log('message', message.text);

  Promise.all([
    web.findUserById(message.user),
    web.findChannelById(message.channel),
  ]).then((values) => {
    const [ user, channel ] = values;

    events.emit(EVENT.MESSAGE, message.text, { user, channel })
  })
})

events.on(EVENT.SEND_MESSAGE, (text, to, onSend) => {
  const channel = to.channel;
  const user = to.user;

  rtm.sendMessage(text, channel.id)
    .then(onSend)
    .catch(console.error);
});

events.on(EVENT.SEND_REACTION, (reaction, to) => {
  const channel = to.channel;
  const ts = to.ts;

  web.addReaction(reaction, { channel, ts });
});

// rtm.on(RTM_EVENTS.BOT_ADDED, (data) => {
//   console.log('bot added', data);
// })

// rtm.on(RTM_EVENTS.CHANNEL_JOINED, (data) => {
//   console.log('channel_joined', data);
// })

// rtm.on(RTM_EVENTS.GROUP_JOINED, (data) => {
//   console.log('group_joined', data);
// })

// rtm.on(RTM_EVENTS.IM_CREATED, (data) => {
//   console.log('im_created', data);
// })

// rtm.on(RTM_EVENTS.MEMBER_JOINED_CHANNEL, (data) => {
//   console.log('member_joined_channel', data);
// })

// rtm.on(RTM_EVENTS.REACTION_ADDED, (data) => {
//   console.log('reaction_added', data);
// })

// rtm.on(RTM_EVENTS.REACTION_REMOVED, (data) => {
//   console.log('reaction_removed', data);
// })

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (connectData) => {
  // appData.selfId = connectData.self.id;
  console.log(`Logged in`);
  // console.log(`Logged in as ${appData.selfId} of team ${connectData.team.id}`);
});

rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
  console.log(`Ready`);
});

// rtm.on(`${RTM_EVENTS.MESSAGE}::${RTM_MESSAGE_SUBTYPES.CHANNEL_NAME}`, (message) => {
//   // For structure of `message`, see https://api.slack.com/events/message/channel_name
//   console.log(`A channel was renamed from ${message.old_name} to ${message.name}`);
// });

// rtm.on(RTM_EVENTS.REACTION_ADDED, (event) => {
//   // For structure of `event`, see https://api.slack.com/events/reaction_added
//   console.log(`User ${event.user} reacted with ${event.reaction}`);
// });

module.exports = {
  configure: () => {
    // 
  },

  run: () => {
    rtm.start();
  },

  // 
}
