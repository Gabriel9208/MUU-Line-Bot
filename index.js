'use strict';

import { messagingApi, middleware } from '@line/bot-sdk';
const { MessagingApiClient } = messagingApi;

import express from 'express';

const clientConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
};

const middlewareConfig = {
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new MessagingApiClient(clientConfig);
const app = express();

app.post('/webhook', middleware(middlewareConfig), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  if (event.replyToken === '00000000000000000000000000000000' || 
    event.replyToken === 'ffffffffffffffffffffffffffffffff') {
    return Promise.resolve(null);
  }

  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [{
      type: 'text',
      text: event.message.text
    }]
  });
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});