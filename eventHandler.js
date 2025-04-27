import { verifySignature } from './lineSecurity.js';
import {
    sendFlexMessage,
    initUserTestResult,
    deleteUserTestResult,
    updateUserTestResult,
    getUserTestCount
} from './flexMessage.js';
import { sendMuu, initUserMuu, deleteUserMuu } from './muuMessages.js';
// import { sendResultToTouchDesigner } from './oscSender.js';

// Custom logger to ensure visibility in Render
export const logger = {
    log: (message) => {
        const timestamp = new Date().toISOString();
        process.stdout.write(`[${timestamp}] INFO: ${message}\n`);
    },
    warn: (message) => {
        const timestamp = new Date().toISOString();
        process.stdout.write(`[${timestamp}] WARNING: ${message}\n`);
    },
    error: (message) => {
        const timestamp = new Date().toISOString();
        process.stderr.write(`[${timestamp}] ERROR: ${message}\n`);
    }
};

// Add startup log to verify logging is working
logger.log('===== LINE BOT SERVER STARTED =====');

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
    logger.log(`[Event Received] Type: ${event.type}, UserId: ${event.source?.userId || 'N/A'}`);

    if (!verifySignature(event)) {
        logger.warn(`[Security] Failed signature verification for userId: ${event.source?.userId || 'N/A'}`);
        if (blackList[event.source.userId] === undefined) {
            blackList[event.source.userId] = 1;
        }
        else {
            blackList[event.source.userId]++;
        }
        logger.warn(`[Blacklist] User ${event.source.userId} has ${blackList[event.source.userId]} strikes`);

        return Promise.resolve(null);
    }


    if (blackList[event.source.userId] != undefined &&
        blackList[event.source.userId] >= BLACKLIST_THRESHOLD) {
        logger.warn(`[Blacklist] Blocked request from blacklisted user: ${event.source.userId}`);
        return Promise.resolve(null);
    }

    // verification messaged
    if (event.replyToken === '00000000000000000000000000000000' ||
        event.replyToken === 'ffffffffffffffffffffffffffffffff') {
        logger.log('[Verification] Received verification message');
        return Promise.resolve(null);
    }

    // Handle postback events first
    if (event.type === "postback") {
        logger.log(`[Postback] Received postback data: ${event.postback.data}`);
        if (event.postback.data.includes("restart")) {
            try {
                logger.log(`[Quiz] User ${event.source.userId} restarting quiz`);
                initUserTestResult(event.source.userId);
                return sendFlexMessage(event.replyToken, event.source.userId, true, false);
            }
            catch (error) {
                logger.error(`[Error] Failed to restart quiz: ${error.message}`);
                return Promise.resolve(null);
            }
        }
        else if (event.postback.data.includes("q5")) {
            try {
                logger.log(`[Quiz] User ${event.source.userId} answered Q5: ${event.postback.data.split(":")[1]}`);
                if (!checkTestCount(event.source.userId, 4)) {
                    logger.warn(`[Quiz] User ${event.source.userId} tried to answer Q5 out of order`);
                    return Promise.resolve(null);
                }

                updateUserTestResult(event.source.userId, event.postback.data.split(":")[1]);
                logger.log(`[Quiz] User ${event.source.userId} completed quiz, sending results`);
                const [quizResult, replyMessage] = sendFlexMessage(event.replyToken, event.source.userId, false, true);
                logger.log(`[Quiz] Quiz result for ${event.source.userId}: ${quizResult}`);

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
                logger.error(`[Error] Failed to process Q5: ${error.message}`);
                return Promise.resolve(null);
            }
        }
        else if (event.postback.data.includes("start") ||
            event.postback.data.includes("q1") ||
            event.postback.data.includes("q2") ||
            event.postback.data.includes("q3") ||
            event.postback.data.includes("q4")
        ) {
            logger.log(`[Quiz] Processing question: ${event.postback.data}`);

            if (event.postback.data.includes("start")) {
                logger.log(`[Quiz] User ${event.source.userId} starting quiz`);
                initUserTestResult(event.source.userId);
            }

            // prevent user from sending messages in an unexpected order
            if (event.postback.data.includes("q1") && !checkTestCount(event.source.userId, 0)) {
                logger.warn(`[Quiz] User ${event.source.userId} tried to answer Q1 out of order`);
                return Promise.resolve(null);
            }
            else if (event.postback.data.includes("q2") && !checkTestCount(event.source.userId, 1)) {
                logger.warn(`[Quiz] User ${event.source.userId} tried to answer Q2 out of order`);
                return Promise.resolve(null);
            }
            else if (event.postback.data.includes("q3") && !checkTestCount(event.source.userId, 2)) {
                logger.warn(`[Quiz] User ${event.source.userId} tried to answer Q3 out of order`);
                return Promise.resolve(null);
            }
            else if (event.postback.data.includes("q4") && !checkTestCount(event.source.userId, 3)) {
                logger.warn(`[Quiz] User ${event.source.userId} tried to answer Q4 out of order`);
                return Promise.resolve(null);
            }


            if (event.postback.data.includes("q1") ||
                event.postback.data.includes("q2") ||
                event.postback.data.includes("q3") ||
                event.postback.data.includes("q4")) {
                logger.log(`[Quiz] User ${event.source.userId} answered ${event.postback.data.split(":")[0]}: ${event.postback.data.split(":")[1]}`);
                updateUserTestResult(event.source.userId, event.postback.data.split(":")[1]);
            }

            try {
                logger.log(`[Quiz] Sending next question to user ${event.source.userId}`);
                const [quizResult, replyMessage] = sendFlexMessage(event.replyToken, event.source.userId, false, false);

                if (quizResult != -1) {
                    logger.error(`[Error] Q1~Q4 received but result calculation failed.`);
                    return Promise.resolve(null);
                }

                return replyMessage;
            }
            catch (error) {
                logger.error(`[Error] Failed to send next question: ${error.message}`);
                return Promise.resolve(null);
            }
        }

        return Promise.resolve(null);
    }

    if (ignoreType.includes(event.type)) {
        try {
            logger.log(`[Quiz] Starting quiz for user ${event.source.userId} from message`);
            // return sendMuu(event.replyToken, event.source.userId);
            initUserTestResult(event.source.userId);
            initUserMuu(event.source.userId);
            return sendFlexMessage(event.replyToken, event.source.userId, true, false);
        }
        catch (error) {
            logger.error(`[Error] Failed to start quiz from message: ${error.message}`);
            return Promise.resolve(null);
        }
    }

    if (event.type == "follow") {
        try {
            logger.log(`[User] New follower: ${event.source.userId}`);
            initUserTestResult(event.source.userId);
            initUserMuu(event.source.userId);
            return sendFlexMessage(event.replyToken, event.source.userId, true, false);
        }
        catch (error) {
            logger.error(`[Error] Failed to handle follow event: ${error.message}`);
            return Promise.resolve(null);
        }
    }
    else if (event.type == "unfollow") {
        logger.log(`[User] User unfollowed: ${event.source.userId}`);
        deleteUserTestResult(event.source.userId);
        deleteUserMuu(event.source.userId);

        return Promise.resolve(null);
    }


    logger.log(`[Event] Unhandled event type: ${event.type}`);
    return Promise.resolve(null);
}

function checkTestCount(userId, count) {
    const testCount = getUserTestCount(userId);
    const isValid = testCount === count;
    logger.log(`[Quiz] User ${userId} test count check: current=${testCount}, expected=${count}, valid=${isValid}`);
    return isValid;
}

