const fs = require("fs");
const path = require("path");
const {
    SecretsManager,
    simulateScript,
    buildRequestCBOR,
    ReturnType,
    decodeResult,
    Location,
    CodeLanguage,
} = require("@chainlink/functions-toolkit");
const automatedFunctionsConsumerAbi = require("./abi/automatedFunctions.json");
const ethers = require("ethers");
const { networks } = require("../../networks");
require("@chainlink/env-enc").config();

task("update-function-api", "Update post request API for function consumer")
    .addParam("consumeraddress", "address of AutomatedFunctionConsumerAddress.sol")
    .addParam("subscriptionid", "chainlink subscription ID")
    .setAction(async (taskArgs, hre) => {
        const { consumeraddress, subscriptionid } = taskArgs
        // const consumerAddress = functionconsumer; // REPLACE this with your Functions consumer address
        // const subscriptionId = 1341; // REPLACE this with your subscription ID
        const donId = networks[network.name].donId;
        const explorerUrl = networks[network.name].explorerUrl;
        // Initialize functions settings
        const source = fs
            .readFileSync(path.resolve(__dirname, "./sources/noti.js"))
            .toString();

        const gasLimit = 300000;

        // Initialize ethers signer and provider to interact with the contracts onchain
        const privateKey = process.env.PRIVATE_KEY; // fetch PRIVATE_KEY
        if (!privateKey)
            throw new Error(
                "private key not provided - check your environment variables"
            );

        const rpcUrl = networks[network.name].rpcUrl;

        if (!rpcUrl)
            throw new Error(`rpcUrl not provided  - check your environment variables`);

        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

        const wallet = new ethers.Wallet(privateKey);
        const signer = wallet.connect(provider); // create ethers signer for signing transactions

        const automatedFunctionsConsumer = new ethers.Contract(
            consumeraddress,
            automatedFunctionsConsumerAbi,
            signer
        );

        // Update request settings
        const transaction = await automatedFunctionsConsumer.updateRequest(
            source,
            subscriptionid,
            gasLimit,
            ethers.utils.formatBytes32String(donId) // jobId is bytes32 representation of donId
        );

        // Log transaction details
        console.log(
            `\n✅ Automated Functions request settings updated! Transaction hash ${transaction.hash} - Check the explorer ${explorerUrl}/tx/${transaction.hash}`
        );



    })