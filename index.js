'use strict';

import { messagingApi, middleware } from '@line/bot-sdk';
const { MessagingApiClient } = messagingApi;

import express from 'express';

const clientConfig = {
  channelAccessToken: "ZOdK1cacumLC3IGdwWkDTFpNtKX1o6FY23/eDGWko69LLIxz6VaEtjoVAJQTa3hKk1yZEGdapeywkQpq4w6XN778TysAo2ijCl04GNK2yqesRG/16VOI9ywq96RhihITqx/PVPwUWI0BqEo66VsoMAdB04t89/1O/w1cDnyilFU=",
};

const middlewareConfig = {
  channelSecret: "22269ce8ea73cc6a345b9f163b66711f",
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