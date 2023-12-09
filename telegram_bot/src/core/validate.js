const { tokensOnFuji } = require("./tokenListOnFuji");

require("dotenv").config();

const incorrectMessage = "Incorrect message format! please try again.";
const notFoundMessage = "Could not found sender or receiver!";
const amountNaNMessage = "Token amount must be a number!";
const incorrectSourceChainMessage = "Source chain must be one of Fuji, Sepolia, or Mumbai!";
const incorrectDesChainMessage = "Destination chain must be one of Fuji, Sepolia, or Mumbai!";
const unsupportedTokenMessage = "Only CCIP-BnM is supported for cross-chain transfer!"

const phonePattern = new RegExp(/^\+[1-9]{1}[0-9]{0,2}[0-9]+$/);
const emailPattern = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/);
const twitterPattern = new RegExp(/^@[a-zA-Z0-9_]{0,15}$/);
const telegramPattern = new RegExp(/^[0-9]+$/);
const onemesNamingPattern = new RegExp(/^[a-zA-Z0-9._-]+\.(onemes)$/);

const getSenderReceiver = async (senderQuery, receiverQuery) => {
    let getReq = await fetch(`${process.env.API_URL}/api/account/get-sender-receiver`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            senderQuery,
            receiverQuery
        })
    })
    let res = await getReq.json();
    return res;
}
const getFilterQuery = (queryArray, chain, value) => {
    if (phonePattern.test(value)) {
        queryArray.push({ phone_number: value, chain: chain })
    }

    if (emailPattern.test(value)) {
        queryArray.push({ email: value, chain: chain })
    }

    if (twitterPattern.test(value)) {
        queryArray.push({ twitter: value, chain: chain })
    }

    if (telegramPattern.test(value)) {
        queryArray.push({ telegram: value, chain: chain })
    }

    if (onemesNamingPattern.test(value)) {
        queryArray.push({ onemes_name: value, chain: chain })
    }
}
const validate = async (sender, message) => {
    let success = true;
    let result = "";
    let senderQuery = [];
    let receiverQuery = [];
    if (message.startsWith("TR")) {
        let stringTokens = message.split(" ");
        if (stringTokens.length !== 4) {
            success = false;
            result = incorrectMessage
        } else {
            let tokenName = stringTokens[1];
            let amount = stringTokens[2];
            let receiver = stringTokens[3];
            let tokenAddress = tokensOnFuji[tokenName.toUpperCase()];
            if (isNaN(amount)) {
                return { success: false, result: amountNaNMessage };
            }
            if (!tokenAddress) {
                return { success: false, result: incorrectMessage };
            }
            getFilterQuery(senderQuery, "fuji", sender);
            getFilterQuery(receiverQuery, "fuji", receiver);
            const senderReceiverData = await getSenderReceiver(senderQuery, receiverQuery);
            if (!senderReceiverData.success || !senderReceiverData.sender || !senderReceiverData.receiver) {
                success = false;
                result = notFoundMessage;
            }
        }
    } else if (message.startsWith("CTR")) {
        let stringTokens = message.split(" ");
        if (stringTokens.length !== 6) {
            success = false;
            result = incorrectMessage
        } else {

            let sourceChain = stringTokens[1];
            let destinationChain = stringTokens[4];
            if (["fuji", "mumbai", "sepolia"].indexOf(sourceChain.toLowerCase()) === -1) {
                return { success: false, result: incorrectSourceChainMessage };
            }

            if (["fuji", "mumbai", "sepolia"].indexOf(destinationChain.toLowerCase()) === -1) {
                return { success: false, result: incorrectDesChainMessage };
            }
            let tokenName = stringTokens[2];
            let amount = stringTokens[3];
            let receiver = stringTokens[5];


            if (tokenName.toLowerCase() !== "ccip-bnm") {
                return { success: false, result: unsupportedTokenMessage };
            }

            if (isNaN(amount)) {
                return { success: false, result: amountNaNMessage };
            }

            getFilterQuery(senderQuery, sourceChain.toLowerCase(), sender);
            getFilterQuery(receiverQuery, destinationChain.toLowerCase(), receiver);

            const senderReceiverData = await getSenderReceiver(senderQuery, receiverQuery);
            if (!senderReceiverData.success || !senderReceiverData.sender || !senderReceiverData.receiver) {
                success = false;
                result = notFoundMessage;
            }
        }
    } else {
        success = false;
        result = incorrectMessage
    }
    return { success: success, result: result }
}

module.exports = {
    validate
}