import { client } from './index.js';

const MUU_THRESHOLD = 6;

function randomInt(max)
{
    return Math.floor(Math.random() * max);
}

// todo: change to the actual url
const audioUrl = [
    ["https://storage.cloud.google.com/choclate-bucket/muu/%E9%84%AD%E9%96%8B%E5%BF%83.mp3", 8000],
    ["https://storage.cloud.google.com/choclate-bucket/muu/%E5%B0%A4%E6%8B%89%E9%96%8B%E5%BF%83.mp3", 8000],
    ["https://storage.cloud.google.com/choclate-bucket/muu/%E8%91%89%E6%86%A4%E6%80%92.mp3", 8000],
    ["https://storage.cloud.google.com/choclate-bucket/muu/%E9%AD%9A%E6%82%B2%E5%82%B7.mp3", 8000],
    ["https://storage.cloud.google.com/choclate-bucket/muu/%E6%A9%98%E7%A9%BA%E8%99%9B.mp3", 8000],
    ["https://storage.cloud.google.com/choclate-bucket/muu/%E8%94%A1%E7%84%A6%E6%85%AE.mp3", 8000]
];


function sendMuu(replyToken, userId) {
    console.log(`sendMuu called with replyToken: ${replyToken}, userId: ${userId}`);

    const randomIndex = randomInt(audioUrl.length);
    const muuMessageTemplate = {
        "type": "audio",
        "originalContentUrl": audioUrl[randomIndex][0],
        "duration": audioUrl[randomIndex][1] //must be exact
    };
    console.log('Sending muuMessageTemplate:', muuMessageTemplate);

    try {
        const result = client.replyMessage({
            replyToken: replyToken,
            messages: [
                muuMessageTemplate
            ]
        });
        console.log('Successfully sent muu message.');
        return result;
    }
    catch (error) {
        console.error("Error from muu message: ", error);
        throw new Error("Error from muu message: " + error);
    }
}


export { sendMuu };
