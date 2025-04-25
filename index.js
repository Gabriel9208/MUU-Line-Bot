'use strict';

import { middleware, MessagingApiClient } from '@line/bot-sdk';
import express from 'express';
import { handleEvent } from './eventHandler.js';


const clientConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
};

const middlewareConfig = {
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};


export const client = new MessagingApiClient(clientConfig);
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});