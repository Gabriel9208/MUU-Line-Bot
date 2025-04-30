import { client } from './index.js';

const question = [
    {
        "label": "q1",
        "question": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_header_1.png",
        "questionOne": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
        "questionTwo": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
        "questionThree": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
        "questionFour": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
        "questionFive": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
        "questionFooter": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_footer.png",
    },
    {
        "label": "q2",
        "question": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_header_1.png",
        "questionOne": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
        "questionTwo": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
        "questionThree": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
        "questionFour": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
        "questionFive": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
        "questionFooter": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_footer.png",
    },
    {
        "label": "q3",
        "question": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_header_1.png",
        "questionOne": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
        "questionTwo": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
        "questionThree": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
        "questionFour": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
        "questionFive": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
        "questionFooter": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_footer.png",
    },
    {
        "label": "q4",
        "question": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_header_1.png",
        "questionOne": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
        "questionTwo": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
        "questionThree": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
        "questionFour": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
        "questionFive": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
        "questionFooter": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_footer.png",
    },
    {
        "label": "q5",
        "question": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_header_1.png",
        "questionOne": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
        "questionTwo": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
        "questionThree": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
        "questionFour": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
        "questionFive": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
        "questionFooter": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_footer.png",
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
    "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_header_1.png",  // 喜
    "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_header_1.png",  // 怒
    "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_header_1.png",  // 哀
    "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_header_1.png",  // 焦
    "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_header_1.png",  // 空
]

let userTestResult = {}; // user id -> a list of results | (string) -> (list)
export let totalResult = [-1]; // 0:喜 1:怒 2:哀 3:焦 4:空

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
            "altText": "this is a flex message",
            "contents": {
                "type": "bubble",
                "size": "giga",
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "image",
                            "url": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_header_1.png",
                            "size": "full",
                            "aspectRatio": "1569:702",
                            "aspectMode": "cover"
                        },
                        {
                            "type": "box",
                            "layout": "horizontal",
                            "contents": [
                                {
                                    "type": "image",
                                    "url": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
                                    "aspectRatio": "1569:277",
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
                            "url": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_footer.png",
                            "aspectRatio": "557:51",
                            "size": "35%"
                        }
                    ],
                    "backgroundColor": "#f6eee4",
                    "paddingAll": "md",
                    "borderWidth": "10px"
                }
            }
        },
        {
            "type": "flex",
            "altText": "this is a flex message",
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
                            "aspectRatio": "1569:702",
                            "aspectMode": "cover"
                        },
                        {
                            "type": "box",
                            "layout": "horizontal",
                            "contents": [
                                {
                                    "type": "image",
                                    "url": question[questionIndex].questionOne,
                                    "aspectRatio": "1569:277",
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
                                    "aspectRatio": "1569:277",
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
                                    "aspectRatio": "1569:277",
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
                                    "aspectRatio": "1569:277",
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
                                    "aspectRatio": "1569:277",
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
                            "url": question[questionIndex].questionFooter,
                            "aspectRatio": "557:51",
                            "size": "35%"
                        }
                    ],
                    "backgroundColor": "#f6eee4",
                    "paddingAll": "md",
                    "borderWidth": "10px"
                }
            }
        },
        {
            "type": "flex",
            "altText": "this is a flex message",
            "contents": {
                "type": "bubble",
                "size": "giga",
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "image",
                            "url": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_header_1.png",
                            "size": "full",
                            "aspectRatio": "1569:702",
                            "aspectMode": "cover"
                        },
                        {
                            "type": "box",
                            "layout": "horizontal",
                            "contents": [
                                {
                                    "type": "image",
                                    "url": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_button_1.png",
                                    "aspectRatio": "1569:277",
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
                            "url": "https://storage.googleapis.com/chichi-chocolate/flex/C_house/house_1_footer.png",
                            "aspectRatio": "557:51",
                            "size": "35%"
                        }
                    ],
                    "backgroundColor": "#f6eee4",
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
    // todo: calculate the result
    return 0;
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

export function getUserTestCount(userId) {
    if (userTestResult[userId] === undefined) {
        return 0;
    }
    return userTestResult[userId].length;
}

export { sendFlexMessage, initUserTestResult, deleteUserTestResult };