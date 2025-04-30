import { Client } from 'osc';
import { RESULT_COUNT } from './flexMessage.js';

const TD_IP = '127.0.0.1';
const TD_PORT = 7000;

const oscClient = new Client(TD_IP, TD_PORT);

function sendOscMessage(address, result) {
  try {
    oscClient.send(address, result);
    console.log(`OSC message sent to ${TD_IP}:${TD_PORT} - ${address} ${result}`);
    return true;
  } catch (error) {
    console.error('Error sending OSC message:', error);
    return false;
  }
}

export function sendResultToTouchDesigner(result) {  
  if (result >= RESULT_COUNT) {
    console.error('Result length exceeds the expected count');
    return;
  }

  sendOscMessage('/linebot/result', result);
} 