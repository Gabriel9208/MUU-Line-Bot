import { middleware, messagingApi } from '@line/bot-sdk';
const { MessagingApiClient } = messagingApi;
import express from 'express';
import { handleEvent } from './eventHandler.js';


const clientConfig = {
  channelAccessToken: "VwuwuCObwHNs/V0LHqWQg3NOy81euL9XG64Qu3eYec9SM8xvsdSblAgNZk9z9yO0MzaSpBJxI4zFuzNNISdgXzMvH+VXN+5uMuKjUskRbeSyjMdGRmN4tgZXIbMHwKo4vE37hUpHufnw8ssNQnxo+AdB04t89/1O/w1cDnyilFU=",
};

const middlewareConfig = {
  channelSecret: "6ff43ae7d6794d45c4c592779faacffa",
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