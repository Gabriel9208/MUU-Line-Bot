const question = [
    {
        "question": "",
        "questionOne": "",
        "questionTwo": "",
        "questionThree": "",
        "questionFour": "",
        "questionFive": "",
    },
    {
        "question": "",
        "questionOne": "",
        "questionTwo": "",
        "questionThree": "",
        "questionFour": "",
        "questionFive": "",
    },
    {
        "question": "",
        "questionOne": "",
        "questionTwo": "",
        "questionThree": "",
        "questionFour": "",
        "questionFive": "",
    },
    {
        "question": "",
        "questionOne": "",
        "questionTwo": "",
        "questionThree": "",
        "questionFour": "",
        "questionFive": "",
    },
    {
        "question": "",
        "questionOne": "",
        "questionTwo": "",
        "questionThree": "",
        "questionFour": "",
        "questionFive": "",
    },
]

const RESULT_COUNT = 16;
const resultImage = [ // todo: change to the actual url
    "https://example.com/original.jpg",  // 喜
    "https://example.com/original.jpg",  // 怒
    "https://example.com/original.jpg",  // 哀
    "https://example.com/original.jpg",  // 焦
    "https://example.com/original.jpg",  // 空
    "https://example.com/original.jpg",  // 喜 + 怒
    "https://example.com/original.jpg",  // 喜 + 哀
    "https://example.com/original.jpg",  // 喜 + 焦
    "https://example.com/original.jpg",  // 喜 + 空
    "https://example.com/original.jpg",  // 怒 + 哀
    "https://example.com/original.jpg",  // 怒 + 焦
    "https://example.com/original.jpg",  // 怒 + 空
    "https://example.com/original.jpg",  // 哀 + 焦
    "https://example.com/original.jpg",  // 哀 + 空
    "https://example.com/original.jpg",  // 焦 + 空
    "https://example.com/original.jpg",  // 陰晴不定
]

let userTestResult = {}; // user id -> a list of results | (string) -> (list)


function sendFlexMessage(replyToken, userId, isFirst, isLast) {
    if (userTestResult[userId] === undefined) {
        return Promise.resolve(null);
    }

    questionIndex = userTestResult[userId].length; // message to be sent

    let message;
    let quizResult = -1;
    const flexMessage = [
        // 前言
        {
            "type": "flex",
            "altText": "心理測驗前言",
            "contents": {
                "type": "bubble",
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "text": "前言",
                            "weight": "bold",
                            "size": "lg",
                            "wrap": true
                        }
                    ]
                },
                "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "spacing": "sm",
                    "contents": [
                        {
                            "type": "button",
                            "style": "primary",
                            "action": {
                                "type": "postback",
                                "label": "開始測驗",
                                "data": "start",
                                "displayText": "開始測驗"
                            }
                        }
                    ]
                }
            }
        },
        // 問題
        {
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
                        "aspectRatio": "1569:702",
                        "aspectMode": "cover"
                    },
                    {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "image",
                                "url": question[questionIndex].questionOne,
                                "aspectRatio": "1569:277",
                                "size": "full"
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
                                "aspectRatio": "1569:277"
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
                                "aspectRatio": "1569:277"
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
                                "aspectRatio": "1569:277"
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
                                "aspectRatio": "1569:277"
                            }
                        ],
                        "offsetTop": "none",
                        "paddingTop": "8px"
                    }
                ],
                "backgroundColor": "#f6eee4",
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
                        "url": "",
                        "aspectRatio": "557:51",
                        "size": "35%"
                    }
                ],
                "backgroundColor": "#f6eee4",
                "paddingAll": "md",
                "borderWidth": "10px"
            }
        },
        // 結果
        {
            "type": "flex",
            "altText": "心理測驗結果",
            "contents": {
                "type": "bubble",
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "text": "結果",
                            "weight": "bold",
                            "size": "lg",
                            "wrap": true
                        }
                    ]
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
        message = [
            flexMessage[2],
            {
                "type": "image",
                "originalContentUrl": resultImage[quizResult],
                "previewImageUrl": resultImage[quizResult]
            }
        ];
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
            messages: JSON.stringify(message)
        })];
    }
    catch (error) {
        throw new Error("Error from flex message: " + error);
    }
}

function calculateResult(userTestResult) // return result id
{
    // calculate the result
    return 0;
}

function initUserTestResult(userId) {
    userTestResult[userId] = [];
}

function deleteUserTestResult(userId) {
    delete userTestResult[userId];
}

export { sendFlexMessage, initUserTestResult, deleteUserTestResult };