import crypto from "crypto";

export function verifySignature(event) {
    const sig = event.headers['X-Line-Signature'] ? event.headers['X-Line-Signature'] : event.headers['x-line-signature'];

    const compareResult = signatureCompare(body, sig);
    if (!compareResult) {
        if (blackList[event.source.userId] === undefined) {
            blackList[event.source.userId] = 1;
        }
        else {
            blackList[event.source.userId]++;
        }
    }
    return compareResult;
}

function signatureCompare(body, signature) {
    const channelSecret = process.env.LINE_CHANNEL_SECRET; // Channel secret string
    const calculatedSignature = crypto
        .createHmac("SHA256", channelSecret)
        .update(body)
        .digest("base64");

    return signature === calculatedSignature;
}

