import { client } from './index.js';

const MUU_THRESHOLD = 7;
let sentMuu = {}; // user id -> muu sent | (string) -> (int)

// todo: change to the actual url
const audioUrl = [
    ("https://example.com/original.m4a", 60000),
    ("https://example.com/original.m4a", 60000),
    ("https://example.com/original.m4a", 60000),
    ("https://example.com/original.m4a", 60000),
    ("https://example.com/original.m4a", 60000),
    ("https://example.com/original.m4a", 60000),
    ("https://example.com/original.m4a", 60000),
];


function sendMuu(replyToken, userId) {
    if (sentMuu[userId] === undefined || sentMuu[userId] >= MUU_THRESHOLD) {
        initUserMuu(userId);
    }

    sentMuu[userId]++;

    const muuMessageTemplate = {
        "type": "audio",
        "originalContentUrl": audioUrl[sentMuu[userId]][0],
        "duration": audioUrl[sentMuu[userId]][1] //must be exact
    };

    try {
        return client.replyMessage({
            replyToken: replyToken,
            messages: [
                JSON.stringify(muuMessageTemplate)
            ]
        });
    }
    catch (error) {
        throw new Error("Error from muu message: " + error);
    }
}

function initUserMuu(userId) {
    sentMuu[userId] = -1;
}

function deleteUserMuu(userId) {
    delete sentMuu[userId];
}

export { sendMuu, initUserMuu, deleteUserMuu };
