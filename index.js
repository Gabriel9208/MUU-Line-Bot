import { middleware, messagingApi } from '@line/bot-sdk';
const { MessagingApiClient } = messagingApi;
import express from 'express';
import { handleEvent } from './eventHandler.js';
import { totalResult } from './flexMessage.js';

// Import custom logger from eventHandler
import { logger } from './eventHandler.js';

const clientConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
};

  const middlewareConfig = {
    channelSecret: process.env.LINE_CHANNEL_SECRET,
};


export const client = new MessagingApiClient(clientConfig);
const app = express();

// Add request logging middleware
app.use((req, res, next) => {
  logger.log(`[HTTP] ${req.method} ${req.url}`);
  next();
});

app.post('/webhook', (req, res, next) => {
  logger.log(`[Webhook] Received webhook request from ${req.headers['x-forwarded-for'] || req.ip}`);
  logger.log(`[Webhook] Headers: ${JSON.stringify(req.headers)}`);
  
  // For debug purposes only - to see raw body
  const rawBody = JSON.stringify(req.body);
  if (rawBody) {
    logger.log(`[Webhook] Raw body received: ${rawBody.substring(0, 200)}${rawBody.length > 200 ? '...' : ''}`);
  } else {
    logger.log(`[Webhook] No raw body found`);
  }
  
  next();
}, middleware(middlewareConfig), (req, res) => {
  logger.log(`[Webhook] Processing ${req.body.events ? req.body.events.length : 0} events`);
  
  if (req.body.events && req.body.events.length > 0) {
    req.body.events.forEach((event, index) => {
      logger.log(`[Webhook] Event ${index+1}/${req.body.events.length}: type=${event.type}, source=${event.source?.type}`);
    });
  }
  
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => {
      logger.log(`[Webhook] Successfully processed events`);
      res.json(result);
    })
    .catch((err) => {
      logger.error(`[Webhook] Error processing events: ${err.message}`);
      console.error(err);
      res.status(500).end();
    });
});

app.head('/health', (req, res) => {
  logger.log('[Health] Health check requested');
  res.status(200).send('OK');
});

app.get('/fetch', (req, res) => {
  res.json({ data: totalResult });
  totalResult = [-1];  
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.log(`[Server] Server listening on port ${port}`);
});