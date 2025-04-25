import { verifySignature } from './lineSecurity.js';
import { sendFlexMessage, initUserTestResult, deleteUserTestResult } from './flexMessage.js';
import { sendMuu, initUserMuu, deleteUserMuu } from './muuMessages.js';
import { sendResultToTouchDesigner } from './oscSender.js';

let blackList = {}; // user id -> the amount of request that user is blocked | (string) -> (int)

const BLACKLIST_THRESHOLD = 5;
const ignoreType = [
  'text',
  'image',
  'video',
  'audio',
  'location',
  'sticker',
  'file',
  'join',
  'leave',
  'beacon',
  'accountLink',
];

export function handleEvent(event) {
    if (!verifySignature(event)) {
      if (blackList[event.source.userId] === undefined) {
        blackList[event.source.userId] = 1;
      }
      else {
        blackList[event.source.userId]++;
      }
  
      return Promise.resolve(null);
    }
  
    if (blackList[event.source.userId] != undefined &&
      blackList[event.source.userId] >= BLACKLIST_THRESHOLD) {
      return Promise.resolve(null);
    }
  
    if (event.destination !== process.env.LINE_USER_ID) {
      if (blackList[event.source.userId] === undefined) {
        blackList[event.source.userId] = 1;
      }
      else {
        blackList[event.source.userId]++;
      }
  
      return Promise.resolve(null);
    }
  
    // verification message
    if (event.replyToken === '00000000000000000000000000000000' ||
      event.replyToken === 'ffffffffffffffffffffffffffffffff') {
      return Promise.resolve(null);
    }
  
    if (ignoreType.includes(event.message.type)) {
      try {
        return sendMuu(event.replyToken, event.source.userId);
      }
      catch (error) {
        console.error(error);
        return Promise.resolve(null);
      }
    }
  
    // follow bot
    if (event.message.type === "follow") {
      try {
        initUserTestResult(event.source.userId);
        initUserMuu(event.source.userId);
        return sendFlexMessage(event.replyToken, event.source.userId, true, false);
      }
      catch (error) {
        console.error(error);
        return Promise.resolve(null);
      }
    }
    else if (event.message.type === "unfollow") {
      deleteUserTestResult(event.source.userId);
      deleteUserMuu(event.source.userId);
  
      return Promise.resolve(null);
    }
    else if (event.message.type === "postback") {
      if (event.postback.data.includes("start") ||
        event.postback.data.includes("q1") ||
        event.postback.data.includes("q2") ||
        event.postback.data.includes("q3") ||
        event.postback.data.includes("q4")
      ) {
        try {
          const [quizResult, replyMessage] = sendFlexMessage(event.replyToken, event.source.userId, false, true);
  
          if (quizResult != -1) {
            console.error("Q1~Q4 recieved but result calculation failed.");
            return Promise.resolve(null);
          }
  
          return replyMessage;
        }
        catch (error) {
          console.error(error);
          return Promise.resolve(null);
        }
      }
      else if (event.postback.data.includes("q5")) {
        try {
          const [quizResult, replyMessage] = sendFlexMessage(event.replyToken, event.source.userId, false, true);
  
          if (quizResult != -1) {
            sendResultToTouchDesigner(quizResult);
          }
          else {
            console.error("Q5 recieved but result calculation failed.");
            return Promise.resolve(null);
          }
  
          return replyMessage;
        }
        catch (error) {
          console.error(error);
          return Promise.resolve(null);
        }
      }
  
      return Promise.resolve(null);
    }
  
    return Promise.resolve(null);
  }