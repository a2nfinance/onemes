const { ethers, BigNumber } = require("ethers");
const cron = require('node-cron');
const json = require("./abi/AutomatedFunctionsConsumer.json");
const { tokensOnFuji } = require("./const/tokenListOnFuji");
const { tokensOnMumbai } = require("./const/tokenListOnMumbai");
const { tokensOnSepolia } = require("./const/tokenListOnSepolia");
const { networks } = require("./const/networks");
const { mockRequests, mockAccounts } = require("./data/mockData");
require("dotenv").config();

const phonePattern = new RegExp(/^\+[1-9]{1}[0-9]{0,2}[0-9]+$/);
const emailPattern = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/);
const twitterPattern = new RegExp(/^@[a-zA-Z0-9_]{0,15}$/);
const telegramPattern = new RegExp(/^[0-9]+$/);
const onemesNamingPattern = new RegExp(/^[a-zA-Z0-9._-]+\.(onemes)$/);
// Test patterns
// console.log(phonePattern.test("+84918760432"));
// console.log(emailPattern.test("levi@a2n.finance"));
// console.log(twitterPattern.test("@levi_a2n"));
// console.log(telegramPattern.test("19282838383"))
// console.log(onemesNamingPattern.test("levi.onemes"))

var contractOnFuji = null;
var contractOnSepolia = null;
var contractOnMumbai = null;

var requestsOnFuji = [];
var requestsOnSepolia = [];
var requestsOnMumbai = [];
const initAutomatedContract = async (network, contractAddress) => {
    try {
        if (!network || !contractAddress) {
            return null;
        }
        const provider = ethers.getDefaultProvider(network);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const factory = new ethers.ContractFactory(json.abi, json.bytecode, wallet)
        const contract = factory.attach(contractAddress);
        return contract;
    } catch (e) {
        console.log(e);
    }

    return null;

}

const getFilterQuery = (queryArray, chain, value) => {
    if (phonePattern.test(value)) {
        queryArray.push({ phone_number: value, network: chain })
    }

    if (emailPattern.test(value)) {
        queryArray.push({ email: value, network: chain })
    }

    if (twitterPattern.test(value)) {
        queryArray.push({ twitter: value, network: chain })
    }

    if (telegramPattern.test(value)) {
        queryArray.push({ telegram: value, network: chain })
    }

    if (onemesNamingPattern.test(value)) {
        queryArray.push({ telegram: value, network: chain })
    }
}

const getDestinationChainSelector = (destinationChain) => {
    return networks[destinationChain.toLowerCase()].chainSelector;
}

const classifyRequests = async () => {
    // RECEIVER can be an address, a phone number, an email, a twitter account, or a telegram id.
    // Get all pending requests
    let getReq = await fetch(`${process.env.API_URL}/api/request/get-pending-request`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    let res = await getReq.json();
    if (res.success && res.data.length) {
        let senderQuery = [];
        let receiverQuery = [];
        // Get requests on Avalanche. Syntax: TR TOKEN_NAME AMOUNT RECEIVER.
        // TOKEN_NAME: AVAX or any
        // const requests = res.data;
        const requests = mockRequests;
        for (let i = 0; i < requests.length; i++) {
            let request = requests[i];
            let sender = request.sender;
            let message = request.message;
            if (message.startsWith("TR")) {
                let stringTokens = message.split(" ");
                let tokenName = stringTokens[1];
                let amount = stringTokens[2];
                let receiver = stringTokens[3];

                getFilterQuery(senderQuery, "fuji", sender);
                getFilterQuery(receiverQuery, "fuji", receiver);

                // get sender account here
                const senderAccount = mockAccounts[0];

                // get receiver account here
                const receiverAccount = mockAccounts[1];

                let receiverAddress = receiverAccount.onemes_account_address;
                if (receiverAccount.use_wallet_address_to_receive) {
                    receiverAddress = receiverAccount.wallet_address
                }

                requestsOnFuji.push({
                    requestId: request._id,
                    onemesSenderAccount: senderAccount.onemes_account_address,
                    receiverAddress: receiverAddress,
                    tokenAddress: tokensOnFuji[tokenName.toUpperCase()],
                    amount: ethers.utils.parseUnits(amount, "18"),
                    chainSelector: 0
                })
                // Build transfer requests here. Formated request: {toAddress, tokenAddress, amount, destinationChainSelector}

            } else if (message.startsWith("CTR")) {

                let stringTokens = message.split(" ");
                let sourceChain = stringTokens[1];
                let tokenName = stringTokens[2];
                let amount = stringTokens[3];
                let destinationChain = stringTokens[4];
                let receiver = stringTokens[5];

                getFilterQuery(senderQuery, sourceChain.toLowerCase(), sender);
                getFilterQuery(receiverQuery, destinationChain.toLowerCase(), receiver);

                // get sender account here
                const senderAccount = mockAccounts[0];

                // get receiver account here
                const receiverAccount = mockAccounts[1];

                let receiverAddress = receiverAccount.onemes_account_address;
                if (receiverAccount.use_wallet_address_to_receive) {
                    receiverAddress = receiverAccount.wallet_address
                }

                const destinationChainSelector = getDestinationChainSelector(destinationChain);

                const sourceChainUpperCase = sourceChain.toUpperCase();

                if (sourceChainUpperCase === "FUJI") {
                    // push the request to the requestsOnFuji array.
                    requestsOnFuji.push({
                        requestId: request._id,
                        onemesSenderAccount: senderAccount.onemes_account_address,
                        receiverAddress: receiverAddress,
                        tokenAddress: tokensOnFuji[tokenName.toUpperCase()],
                        amount:  ethers.utils.parseUnits(amount, "18"),
                        chainSelector: destinationChainSelector
                    })

                }

                if (sourceChainUpperCase === "SEPOLIA") {
                    // push the request to the requestsOnSepolia array.
                    requestsOnSepolia.push({
                        requestId: request._id,
                        onemesSenderAccount: senderAccount.onemes_account_address,
                        receiverAddress: receiverAddress,
                        tokenAddress: tokensOnSepolia[tokenName.toUpperCase()],
                        amount:  ethers.utils.parseUnits(amount, "18"),
                        chainSelector: destinationChainSelector
                    })
                }

                if (sourceChainUpperCase === "MUMBAI") {
                    // push the request to the requestsOnMumbai array.
                    requestsOnMumbai.push({
                        requestId: request._id,
                        onemesSenderAccount: senderAccount.onemes_account_address,
                        receiverAddress: receiverAddress,
                        tokenAddress: tokensOnMumbai[tokenName.toUpperCase()],
                        amount:  ethers.utils.parseUnits(amount, "18"),
                        chainSelector: destinationChainSelector
                    })
                }



                // Build transfer requests here. Formated request: {toAddress, tokenAddress, amount, destinationChainSelector}
            }
        }

        console.log(senderQuery, receiverQuery);

        // Get cross chain pending requests. Syntax: CTR SOURCE_CHAIN TOKEN_NAME AMOUNT DESTINATION_CHAIN RECEIVER.
        // SOURCE_CHAIN & DESTINATION_CHAIN can be "FUJI", "SEPOLIA", or "MUMBAI"
        // TOKEN_NAME: CCIP-BnM
        console.log("Requests on FUJI:", requestsOnFuji);
        console.log("Requests on Sepolia:", requestsOnSepolia);
        console.log("Requests on Mumbai:", requestsOnMumbai)

    }

}

// classifyRequests();

contractOnFuji = initAutomatedContract(process.env.FUJI_RPC, process.env.FUJI_CONTRACT_ADDRESS);

contractOnSepolia = initAutomatedContract(process.env.SEPOLIA_RPC, process.env.SEPOLIA_CONTRACT_ADDRESS);

contractOnMumbai = initAutomatedContract(process.env.MUMBAI_RPC, process.env.MUMBAI_CONTRACT_ADDRESS);
const fn = async () => {
    await classifyRequests();
    contractOnFuji = await initAutomatedContract(process.env.FUJI_RPC, process.env.FUJI_CONTRACT_ADDRESS);
    const requests = requestsOnFuji.map(r => ([
        r.requestId,
        r.onemesSenderAccount,
        r.receiverAddress,
        r.tokenAddress,
        r.amount,
        new BigNumber.from(r.chainSelector)
    ]));
    console.log(requests);
    const sendTokensTx = await contractOnFuji.updatePendingTransferRequests(
        requests
    )
    await sendTokensTx.wait()
    console.log("\nTx hash is ", sendTokensTx.hash)
}

fn();

// cron.schedule('*/5 * * * * *', async () => {
//     if (contractOnFuji && requestsOnFuji.length) {
//         const sendTokensTx = await contractOnFuji.updatePendingTransferRequest(

//             requestsOnFuji.map(r => ([
//                 r.requestId,
//                 r.onemesSenderAccount,
//                 r.receiverAddress,
//                 r.tokenAddress,
//                 r.amount,
//                 r.chainSelector
//             ]))
//         )
//         await sendTokensTx.wait()
//         console.log("\nTx hash is ", sendTokensTx.hash)
//     }

//     if (contractOnMumbai && requestsOnMumbai.length) {
//         const sendTokensTx = await contractOnFuji.updatePendingTransferRequest(

//             requestsOnMumbai.map(r => ([
//                 r.requestId,
//                 r.onemesSenderAccount,
//                 r.receiverAddress,
//                 r.tokenAddress,
//                 r.amount,
//                 r.chainSelector
//             ]))
//         )
//         await sendTokensTx.wait()
//         console.log("\nTx hash is ", sendTokensTx.hash)
//     }

//     if (contractOnSepolia && requestsOnSepolia.length) {
//         const sendTokensTx = await contractOnFuji.updatePendingTransferRequest(

//             requestsOnSepolia.map(r => ([
//                 r.requestId,
//                 r.onemesSenderAccount,
//                 r.receiverAddress,
//                 r.tokenAddress,
//                 r.amount,
//                 r.chainSelector
//             ]))
//         )
//         await sendTokensTx.wait()
//         console.log("\nTx hash is ", sendTokensTx.hash)
//     }

// });