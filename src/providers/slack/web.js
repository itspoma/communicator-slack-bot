const { WebClient } = require('@slack/client');

let web;

const configure = () => {
  const token = process.env.SLACK_BOT_OAUTH_TOKEN;

  web = new WebClient(token);
}

const findUserById = (id) => {
  return new Promise((resolve, reject) => {
    web.users.info(id)
      .then(response => resolve(response.user))
      .catch(reject);
  })
}

const findChannelById = (id) => {
  return new Promise((resolve, reject) => {
    web.channels.info(id)
      .then(response => resolve(response.channel))
      .catch(reject);
  })
}

const addReaction = (emoji, params) => {
  return new Promise((resolve, reject) => {
    web.reactions.add(emoji, {
      channel: params.channel,
      timestamp: params.ts,
    })
      .then(resolve)
      .catch(reject);
  });
}

const getReactions = (params) => {
  return new Promise((resolve, reject) => {
    web.reactions.get({
      channel: params.channel,
      timestamp: params.ts,
      full: true
    })
      .then(response => resolve(response.message.reactions))
      .catch(reject);
  });
}

module.exports = {
  configure,
  findUserById,
  findChannelById,
  addReaction,
  getReactions,
}
