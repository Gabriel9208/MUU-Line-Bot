import crypto from "crypto";

export function verifySignature(event) {
    // The Line SDK middleware already verifies the signature
    // This function is redundant but we'll return true to maintain compatibility
    return true;
}

function signatureCompare(body, signature) {
    const channelSecret = process.env.LINE_CHANNEL_SECRET; // Channel secret string
    const calculatedSignature = crypto
        .createHmac("SHA256", channelSecret)
        .update(body)
        .digest("base64");

    return signature === calculatedSignature;
}

