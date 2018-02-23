require('dotenv').config()

const events = require('../modules/events');
const slack = require('../providers/slack');

const configurate = () => {
  events.configure();
  slack.configure();
}

const run = () => {
  slack.run();
}

module.exports = {
  configurate: configurate,
  run: run,
}

// [
//   'NODE_ENV',
//   'PORT'
// ].forEach((name) => {
//   if (!process.env[name]) {
//     throw new Error(`Environment variable ${name} is missing`)
//   }
// })
