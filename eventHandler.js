import { verifySignature } from './lineSecurity.js';
import { sendFlexMessage, 
    initUserTestResult, 
    deleteUserTestResult, 
    updateUserTestResult,
    getUserTestCount } from './flexMessage.js';
import { sendMuu, initUserMuu, deleteUserMuu } from './muuMessages.js';
// import { sendResultToTouchDesigner } from './oscSender.js';

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
    console.log(`[Event Received] Type: ${event.type}, UserId: ${event.source?.userId || 'N/A'}`);

    if (!verifySignature(event)) {
        console.warn(`[Security] Failed signature verification for userId: ${event.source?.userId || 'N/A'}`);
        if (blackList[event.source.userId] === undefined) {
            blackList[event.source.userId] = 1;
        }
        else {
            blackList[event.source.userId]++;
        }
        console.warn(`[Blacklist] User ${event.source.userId} has ${blackList[event.source.userId]} strikes`);

        return Promise.resolve(null);
    }


    if (blackList[event.source.userId] != undefined &&
        blackList[event.source.userId] >= BLACKLIST_THRESHOLD) {
        console.warn(`[Blacklist] Blocked request from blacklisted user: ${event.source.userId}`);
        return Promise.resolve(null);
    }

    if (event.destination !== process.env.LINE_USER_ID) {
        console.warn(`[Security] Destination mismatch: ${event.destination} vs ${process.env.LINE_USER_ID}`);
        if (blackList[event.source.userId] === undefined) {
            blackList[event.source.userId] = 1;
        }
        else {
            blackList[event.source.userId]++;
        }
        console.warn(`[Blacklist] User ${event.source.userId} has ${blackList[event.source.userId]} strikes`);

        return Promise.resolve(null);
    }

    // verification message
    if (event.replyToken === '00000000000000000000000000000000' ||
        event.replyToken === 'ffffffffffffffffffffffffffffffff') {
        console.log('[Verification] Received verification message');
        return Promise.resolve(null);
    }

    // Handle postback events first
    if (event.type === "postback") {
        console.log(`[Postback] Received postback data: ${event.postback.data}`);
        if (event.postback.data.includes("restart")) {
            try {
                console.log(`[Quiz] User ${event.source.userId} restarting quiz`);
                initUserTestResult(event.source.userId);
                return sendFlexMessage(event.replyToken, event.source.userId, true, false);
            }
            catch (error) {
                console.error(`[Error] Failed to restart quiz: ${error.message}`);
                return Promise.resolve(null);
            }
        }
        else if (event.postback.data.includes("q5")) {
            try {
                console.log(`[Quiz] User ${event.source.userId} answered Q5: ${event.postback.data.split(":")[1]}`);
                if (!checkTestCount(event.source.userId , 4)) {
                    console.warn(`[Quiz] User ${event.source.userId} tried to answer Q5 out of order`);
                    return Promise.resolve(null);
                }

                updateUserTestResult(event.source.userId, event.postback.data.split(":")[1]);
                console.log(`[Quiz] User ${event.source.userId} completed quiz, sending results`);
                const [quizResult, replyMessage] = sendFlexMessage(event.replyToken, event.source.userId, false, true);
                console.log(`[Quiz] Quiz result for ${event.source.userId}: ${quizResult}`);

                /*
                if (quizResult != -1) {
                  sendResultToTouchDesigner(quizResult);
                }
                else {
                  console.error("Q5 recieved but result calculation failed.");
                  return Promise.resolve(null);
                }
                */
                return replyMessage;
            }
            catch (error) {
                console.error(`[Error] Failed to process Q5: ${error.message}`);
                return Promise.resolve(null);
            }
        }
        else if (event.postback.data.includes("start") ||
            event.postback.data.includes("q1") ||
            event.postback.data.includes("q2") ||
            event.postback.data.includes("q3") ||
            event.postback.data.includes("q4")
        ) {
            console.log(`[Quiz] Processing question: ${event.postback.data}`);

            if(event.postback.data.includes("start")) {
                console.log(`[Quiz] User ${event.source.userId} starting quiz`);
                initUserTestResult(event.source.userId);
            }

            // prevent user from sending messages in an unexpected order
            if (event.postback.data.includes("q1") && !checkTestCount(event.source.userId, 0)) {
                console.warn(`[Quiz] User ${event.source.userId} tried to answer Q1 out of order`);
                return Promise.resolve(null);
            }
            else if (event.postback.data.includes("q2") && !checkTestCount(event.source.userId, 1)) {
                console.warn(`[Quiz] User ${event.source.userId} tried to answer Q2 out of order`);
                return Promise.resolve(null);
            }
            else if (event.postback.data.includes("q3") && !checkTestCount(event.source.userId, 2)) {
                console.warn(`[Quiz] User ${event.source.userId} tried to answer Q3 out of order`);
                return Promise.resolve(null);
            }
            else if (event.postback.data.includes("q4") && !checkTestCount(event.source.userId, 3)) {
                console.warn(`[Quiz] User ${event.source.userId} tried to answer Q4 out of order`);
                return Promise.resolve(null);
            }


            if (event.postback.data.includes("q1") ||
                event.postback.data.includes("q2") ||
                event.postback.data.includes("q3") ||
                event.postback.data.includes("q4")) {
                console.log(`[Quiz] User ${event.source.userId} answered ${event.postback.data.split(":")[0]}: ${event.postback.data.split(":")[1]}`);
                updateUserTestResult(event.source.userId, event.postback.data.split(":")[1]);
            }

            try {
                console.log(`[Quiz] Sending next question to user ${event.source.userId}`);
                const [quizResult, replyMessage] = sendFlexMessage(event.replyToken, event.source.userId, false, false);

                if (quizResult != -1) {
                    console.error(`[Error] Q1~Q4 received but result calculation failed.`);
                    return Promise.resolve(null);
                }

                return replyMessage;
            }
            catch (error) {
                console.error(`[Error] Failed to send next question: ${error.message}`);
                return Promise.resolve(null);
            }
        }

        return Promise.resolve(null);
    }

    // Handle message events
    if (event.message && event.message.type) {
        console.log(`[Message] Received message type: ${event.message.type}`);
        if (ignoreType.includes(event.message.type)) {
            try {
                console.log(`[Quiz] Starting quiz for user ${event.source.userId} from message`);
                // return sendMuu(event.replyToken, event.source.userId);
                initUserTestResult(event.source.userId);
                initUserMuu(event.source.userId);
                return sendFlexMessage(event.replyToken, event.source.userId, true, false);
            }
            catch (error) {
                console.error(`[Error] Failed to start quiz from message: ${error.message}`);
                return Promise.resolve(null);
            }
        }

        // follow bot
        if (event.message.type === "follow") {
            try {
                console.log(`[User] New follower: ${event.source.userId}`);
                initUserTestResult(event.source.userId);
                initUserMuu(event.source.userId);
                return sendFlexMessage(event.replyToken, event.source.userId, true, false);
            }
            catch (error) {
                console.error(`[Error] Failed to handle follow event: ${error.message}`);
                return Promise.resolve(null);
            }
        }
        else if (event.message.type === "unfollow") {
            console.log(`[User] User unfollowed: ${event.source.userId}`);
            deleteUserTestResult(event.source.userId);
            deleteUserMuu(event.source.userId);

            return Promise.resolve(null);
        }
    }

    console.log(`[Event] Unhandled event type: ${event.type}`);
    return Promise.resolve(null);
}

function checkTestCount(userId, count) {
    const testCount = getUserTestCount(userId);
    const isValid = testCount === count;
    console.log(`[Quiz] User ${userId} test count check: current=${testCount}, expected=${count}, valid=${isValid}`);
    return isValid;
}

