import { client } from './index.js';

const question = [
    {
        "label": "q1",
        "question": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q1.png",
        "questionOne": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q1a.png",
        "questionTwo": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q1b.png",
        "questionThree": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q1c.png",
        "questionFour": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q1d.png",
        "questionFive": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q1e.png",
        "questionFooter": "https://storage.googleapis.com/choclate-bucket/muu/muuline-%E5%89%8D%E8%A8%80%E9%A1%8C%E7%9B%AE%E5%BA%95%E6%8F%90%E7%A4%BA.png",
    },
    {
        "label": "q2",
        "question": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q2.png",
        "questionOne": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q2a.png",
        "questionTwo": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q2b.png",
        "questionThree": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q2c.png",
        "questionFour": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q2d.png",
        "questionFive": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q2e.png",
        "questionFooter": "https://storage.googleapis.com/choclate-bucket/muu/muuline-%E5%89%8D%E8%A8%80%E9%A1%8C%E7%9B%AE%E5%BA%95%E6%8F%90%E7%A4%BA.png",
    },
    {
        "label": "q3",
        "question": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q3.png",
        "questionOne": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q3a.png",
        "questionTwo": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q3b.png",
        "questionThree": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q3c.png",
        "questionFour": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q3d.png",
        "questionFive": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q3e.png",
        "questionFooter": "https://storage.googleapis.com/choclate-bucket/muu/muuline-%E5%89%8D%E8%A8%80%E9%A1%8C%E7%9B%AE%E5%BA%95%E6%8F%90%E7%A4%BA.png",
    },
    {
        "label": "q4",
        "question": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q4.png",
        "questionOne": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q4a.png",
        "questionTwo": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q4b.png",
        "questionThree": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q4c.png",
        "questionFour": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q4d.png",
        "questionFive": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q4e.png",
        "questionFooter": "https://storage.googleapis.com/choclate-bucket/muu/muuline-%E5%89%8D%E8%A8%80%E9%A1%8C%E7%9B%AE%E5%BA%95%E6%8F%90%E7%A4%BA.png",
    },
    {
        "label": "q5",
        "question": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q5.png",
        "questionOne": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q5a.png",
        "questionTwo": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q5b.png",
        "questionThree": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q5c.png",
        "questionFour": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q5d.png",
        "questionFive": "https://storage.googleapis.com/choclate-bucket/muu/muuline-Q5e.png",
        "questionFooter": "https://storage.googleapis.com/choclate-bucket/muu/muuline-%E5%89%8D%E8%A8%80%E9%A1%8C%E7%9B%AE%E5%BA%95%E6%8F%90%E7%A4%BA.png",
    },
    {
        "label": "none",
        "question": "none",
        "questionOne": "none",
        "questionTwo": "none",
        "questionThree": "none",
        "questionFour": "none",
        "questionFive": "none",
        "questionFooter": "none",
    }
]

const RESULT_COUNT = 5;
const resultImage = [ // todo: change to the actual url
    "https://storage.googleapis.com/choclate-bucket/muu/muulineresult_happy.jpg",  // 喜
    "https://storage.googleapis.com/choclate-bucket/muu/muulineresult_mad.jpg",  // 怒
    "https://storage.googleapis.com/choclate-bucket/muu/muulineresult_sad.jpg",  // 哀
    "https://storage.googleapis.com/choclate-bucket/muu/muulineresult_con.jpg",  // 焦
    "https://storage.googleapis.com/choclate-bucket/muu/muulineresult_banana.jpg",  // 空
]

let userTestResult = {}; // user id -> a list of results | (string) -> (list)
let totalResult = [1]; // 0:喜 1:怒 2:哀 3:焦 4:空

function sendFlexMessage(replyToken, userId, isFirst, isLast) {
    if (userTestResult[userId] === undefined) {
        userTestResult[userId] = [];
    }

    let questionIndex = userTestResult[userId].length; // message to be sent
    let message;
    let quizResult = -1;
    const flexMessage = [
        {
            "type": "flex",
            "altText": "MuUuUUu~ ┌(;￣◇￣)┘",
            "contents": {
                "type": "bubble",
                "size": "giga",
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "image",
                            "url": "https://storage.googleapis.com/choclate-bucket/muu/muuline-%E5%89%8D%E8%A8%80%E4%BF%AE%E6%AD%A3.png",
                            "size": "full",
                            "aspectRatio": "3279:3962",
                            "aspectMode": "cover"
                        },
                        {
                            "type": "box",
                            "layout": "horizontal",
                            "contents": [
                                {
                                    "type": "image",
                                    "url": "https://storage.googleapis.com/choclate-bucket/muu/muuline-%E5%89%8D%E8%A8%80%E6%8C%89%E9%88%95.png",
                                    "aspectRatio": "3279:576",
                                    "size": "full",
                                    "action": {
                                        "type": "postback",
                                        "label": "start",
                                        "data": "start"
                                    }
                                }
                            ],
                            "paddingTop": "8px"
                        }
                    ],
                    "backgroundColor": "#ffffff",
                    "paddingTop": "20px",
                    "paddingStart": "20px",
                    "paddingEnd": "20px",
                    "paddingBottom": "0px"
                },
                "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "image",
                            "url": "https://storage.googleapis.com/choclate-bucket/muu/muuline-%E5%89%8D%E8%A8%80%E9%A1%8C%E7%9B%AE%E5%BA%95%E6%8F%90%E7%A4%BA.png",
                            "aspectRatio": "3279:90",
                            "size": "1000%"
                        }
                    ],
                    "backgroundColor": "#ffffff",
                    "paddingAll": "md",
                    "borderWidth": "10px"
                }
            }
        },
        {
            "type": "flex",
            "altText": "MuUuUUu~ ┌(;￣◇￣)┘",
            "contents": {
                "type": "bubble",
                "size": "giga",
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "image",
                            "url": question[questionIndex].question,
                            "size": "full",
                            "aspectRatio": "3279:1557",
                            "aspectMode": "cover"
                        },
                        {
                            "type": "box",
                            "layout": "horizontal",
                            "contents": [
                                {
                                    "type": "image",
                                    "url": question[questionIndex].questionOne,
                                    "aspectRatio": "3279:527",
                                    "size": "full",
                                    "action": {
                                        "type": "postback",
                                        "label": question[questionIndex].label,
                                        "data": question[questionIndex].label + ":1"
                                    }
                                }
                            ],
                            "paddingTop": "8px"
                        },
                        {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "image",
                                    "url": question[questionIndex].questionTwo,
                                    "size": "full",
                                    "aspectRatio": "3279:527",
                                    "action": {
                                        "type": "postback",
                                        "label": question[questionIndex].label,
                                        "data": question[questionIndex].label + ":2"
                                    }
                                }
                            ],
                            "paddingTop": "8px"
                        },
                        {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "image",
                                    "url": question[questionIndex].questionThree,
                                    "size": "full",
                                    "aspectRatio": "3279:527",
                                    "action": {
                                        "type": "postback",
                                        "label": question[questionIndex].label,
                                        "data": question[questionIndex].label + ":3"
                                    }
                                }
                            ],
                            "offsetTop": "none",
                            "paddingTop": "8px"
                        },
                        {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "image",
                                    "url": question[questionIndex].questionFour,
                                    "size": "full",
                                    "aspectRatio": "3279:527",
                                    "action": {
                                        "type": "postback",
                                        "label": question[questionIndex].label,
                                        "data": question[questionIndex].label + ":4"
                                    }
                                }
                            ],
                            "offsetTop": "none",
                            "paddingTop": "8px"
                        },
                        {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "image",
                                    "url": question[questionIndex].questionFive,
                                    "size": "full",
                                    "aspectRatio": "3279:527",
                                    "action": {
                                        "type": "postback",
                                        "label": question[questionIndex].label,
                                        "data": question[questionIndex].label + ":5"
                                    }
                                }
                            ],
                            "offsetTop": "none",
                            "paddingTop": "8px"
                        }
                    ],
                    "backgroundColor": "#ffffff",
                    "paddingTop": "20px",
                    "paddingStart": "20px",
                    "paddingEnd": "20px",
                    "paddingBottom": "0px"
                },
                "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "image",
                            "url": question[questionIndex].questionFooter,
                            "aspectRatio": "3279:90",
                            "size": "1000%"
                        }
                    ],
                    "backgroundColor": "#ffffff",
                    "paddingAll": "md",
                    "borderWidth": "10px"
                }
            }
        },
        {
            "type": "flex",
            "altText": "MuUuUUu~ ┌(;￣◇￣)┘",
            "contents": {
                "type": "bubble",
                "size": "giga",
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "image",
                            "url": "https://storage.googleapis.com/choclate-bucket/muu/muuline-%E7%B5%90%E8%AA%9E.png",
                            "size": "full",
                            "aspectRatio": "3279:4117",
                            "aspectMode": "cover"
                        },
                        {
                            "type": "box",
                            "layout": "horizontal",
                            "contents": [
                                {
                                    "type": "image",
                                    "url": "https://storage.googleapis.com/choclate-bucket/muu/muuline-%E7%B5%90%E8%AA%9E%E6%8C%89%E9%88%95.png",
                                    "aspectRatio": "3279:527",
                                    "size": "full",
                                    "action": {
                                        "type": "postback",
                                        "label": "restart",
                                        "data": "restart"
                                    }
                                }
                            ],
                            "paddingTop": "8px"
                        }
                    ],
                    "backgroundColor": "#ffffff",
                    "paddingTop": "20px",
                    "paddingStart": "20px",
                    "paddingEnd": "20px",
                    "paddingBottom": "0px"
                },
                "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "image",
                            "url": "https://storage.googleapis.com/choclate-bucket/muu/muuline-%E5%89%8D%E8%A8%80%E9%A1%8C%E7%9B%AE%E5%BA%95%E6%8F%90%E7%A4%BA.png",
                            "aspectRatio": "3279:90",
                            "size": "1000%"
                        }
                    ],
                    "backgroundColor": "#ffffff",
                    "paddingAll": "md",
                    "borderWidth": "10px"
                }
            }
        },
    ];

    if (isFirst) {
        message = [flexMessage[0]];
    }
    else if (isLast) {
        quizResult = calculateResult(userTestResult[userId]);
        if (quizResult >= RESULT_COUNT) {
            throw new Error("Error from flex message: " + "Quiz result out of range");
        }

        totalResult.push(quizResult);

        message = [
            flexMessage[2],
            {
                "type": "image",
                "originalContentUrl": resultImage[quizResult],
                "previewImageUrl": resultImage[quizResult]
            }
        ];
        deleteUserTestResult(userId);
    }
    else {
        if (questionIndex >= question.length) {
            deleteUserTestResult(userId);
            initUserTestResult(userId);
        }

        message = [flexMessage[1]];
    }

    try {
        return [quizResult,
            client.replyMessage({
                replyToken: replyToken,
                messages: message
            })];
    }
    catch (error) {
        throw new Error("Error from flex message: " + error);
    }
}

export function updateUserTestResult(userId, result) {
    if (userTestResult[userId] === undefined) {
        userTestResult[userId] = [];
    }
    userTestResult[userId].push(result);
}

function calculateResult(userTestResult) // return result id
{
    // Count occurrences of each number (0-4)
    let counts = [0, 0, 0, 0, 0];
    for (const result of userTestResult) {
        if (result >= 0 && result <= 4) {
            counts[result]++;
        }
    }

    // If there are 3 or more 1's, return 1
    if (counts[0] >= 3) {
        return 0;
    }
    else if (counts[1] >= 3) {
        return 1;
    }
    else if (counts[2] >= 3) {
        return 2;
    }
    else if (counts[3] >= 3) {
        return 3;
    }
    else if (counts[4] >= 3) {
        return 4;
    }

    let candidates = [];
    if (counts[0] >= 2) {
        candidates.push(0);
    }
    if (counts[1] >= 2) {
        candidates.push(1);
    }
    if (counts[2] >= 2) {
        candidates.push(2);
    }
    if (counts[3] >= 2) {
        candidates.push(3);
    }
    if (counts[4] >= 2) {
        candidates.push(4);
    }

    if (candidates.length === 2) {
        return candidates[Math.floor(Math.random() * 2)];
    }
    else if (candidates.length === 1) {
        return candidates[0];
    }
    else if (candidates.length === 0) {
        return Math.floor(Math.random() * 5);
    }

    return 3;
}

function initUserTestResult(userId) {
    deleteUserTestResult(userId);

    userTestResult[userId] = [];
}

function deleteUserTestResult(userId) {
    if (userTestResult[userId] != undefined) {
        delete userTestResult[userId];
    }
}

function generateFlag() {
    let randomString = Math.random().toString(36).substring(2, 15) + "!@#$%^&*()_+"[Math.floor(Math.random() * 12)];
    return "MUU{mUu0u_uU3Uo_" + randomString + "!}";
}

export function getTotalResult() {
    return [...totalResult];
}

export function resetTotalResult() {
    totalResult = [];
}

// for debugging
export function generateRandomTotalResult() {
    let randomAmount = Math.floor(Math.random() * 5) + 1; // Generate 1-5 elements
    totalResult = [];
    for (let i = 0; i < randomAmount; i++) {
        totalResult.push(Math.floor(Math.random() * 5)); // Generate numbers 0-4
    }
}


export function getUserTestCount(userId) {
    if (userTestResult[userId] === undefined) {
        return 0;
    }
    return userTestResult[userId].length;
}

export { sendFlexMessage, initUserTestResult, deleteUserTestResult };