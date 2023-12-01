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
require("@chainlink/env-enc").config();

const consumerAddress = "0xa8080C7D771dc5B7a2e13E5803dAB0253BC145D5"; // REPLACE this with your Functions consumer address
const subscriptionId = 1341; // REPLACE this with your subscription ID

const updateRequestFuji = async () => {
    // hardcoded for Avalanche Fuji
    const routerAddress = "0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0";
    const donId = "fun-avalanche-fuji-1";
    const gatewayUrls = [
        "https://01.functions-gateway.testnet.chain.link/",
        "https://02.functions-gateway.testnet.chain.link/"
    ];
    const explorerUrl = "https://testnet.avascan.info";

    // Initialize functions settings
    const source = fs
        .readFileSync(path.resolve(__dirname, "./sources/noti.js"))
        .toString();

    const args = ["1", "bitcoin", "btc-bitcoin"];
    const secrets = { apiKey: process.env.API_KEY };
    const slotIdNumber = 0; // slot ID where to upload the secrets
    const expirationTimeMinutes = 150; // expiration time in minutes of the secrets
    const gasLimit = 300000;

    // Initialize ethers signer and provider to interact with the contracts onchain
    const privateKey = process.env.PRIVATE_KEY; // fetch PRIVATE_KEY
    if (!privateKey)
        throw new Error(
            "private key not provided - check your environment variables"
        );

    const rpcUrl = process.env.AVALANCHE_FUJI_RPC_URL; // fetch mumbai RPC URL

    if (!rpcUrl)
        throw new Error(`rpcUrl not provided  - check your environment variables`);

    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    const wallet = new ethers.Wallet(privateKey);
    const signer = wallet.connect(provider); // create ethers signer for signing transactions

    ///////// START SIMULATION ////////////

    console.log("Start simulation...");


    const response = await simulateScript({
        source: source,
        args: args,
        bytesArgs: [], // bytesArgs - arguments can be encoded off-chain to bytes.
        secrets: {},
    });

    console.log("Simulation result", response);
    const errorString = response.errorString;
    if (errorString) {
        console.log(`❌ Error during simulation: `, errorString);
    } else {
        const returnType = ReturnType.uint256;
        const responseBytesHexstring = response.responseBytesHexstring;
        if (ethers.utils.arrayify(responseBytesHexstring).length > 0) {
            const decodedResponse = decodeResult(
                response.responseBytesHexstring,
                returnType
            );
            console.log(`✅ Decoded response to ${returnType}: `, decodedResponse);
        }
    }

    // //////// MAKE REQUEST ////////

    // console.log("\nMake request...");

    // // First encrypt secrets and upload the encrypted secrets to the DON
    // const secretsManager = new SecretsManager({
    //     signer: signer,
    //     functionsRouterAddress: routerAddress,
    //     donId: donId,
    // });
    // await secretsManager.initialize();

    // // Encrypt secrets and upload to DON
    // const encryptedSecretsObj = await secretsManager.encryptSecrets(
    //     secrets
    // );

    // console.log(
    //     `Upload encrypted secret to gateways ${gatewayUrls}. slotId ${slotIdNumber}. Expiration in minutes: ${expirationTimeMinutes}`
    // );
    // // Upload secrets
    // const uploadResult = await secretsManager.uploadEncryptedSecretsToDON({
    //     encryptedSecretsHexstring: encryptedSecretsObj.encryptedSecrets,
    //     gatewayUrls: gatewayUrls,
    //     slotId: slotIdNumber,
    //     minutesUntilExpiration: expirationTimeMinutes,
    // });

    // if (!uploadResult.success)
    //     throw new Error(`Encrypted secrets not uploaded to ${gatewayUrls}`);

    // console.log(
    //     `\n✅ Secrets uploaded properly to gateways ${gatewayUrls}! Gateways response: `,
    //     uploadResult
    // );

    // const donHostedSecretsVersion = parseInt(uploadResult.version); // fetch the version of the encrypted secrets
    // const donHostedEncryptedSecretsReference =
    //     secretsManager.buildDONHostedEncryptedSecretsReference({
    //         slotId: slotIdNumber,
    //         version: donHostedSecretsVersion,
    //     }); // encode encrypted secrets version

    const automatedFunctionsConsumer = new ethers.Contract(
        consumerAddress,
        automatedFunctionsConsumerAbi,
        signer
    );

    // // // Encode request

    // const functionsRequestBytesHexString = buildRequestCBOR({
    //     codeLocation: Location.Inline, // Location of the source code - Only Inline is supported at the moment
    //     codeLanguage: CodeLanguage.JavaScript, // Code language - Only JavaScript is supported at the moment
    //     secretsLocation: Location.DONHosted, // Location of the encrypted secrets - DONHosted in this example
    //     source: source, // soure code
    //     // encryptedSecretsReference: {},
    //     args: [],
    //     bytesArgs: [], // bytesArgs - arguments can be encoded off-chain to bytes.
    // });

    // Update request settings
    const transaction = await automatedFunctionsConsumer.updateRequest(
        source,
        subscriptionId,
        gasLimit,
        ethers.utils.formatBytes32String(donId) // jobId is bytes32 representation of donId
    );

    // Log transaction details
    console.log(
        `\n✅ Automated Functions request settings updated! Transaction hash ${transaction.hash} - Check the explorer ${explorerUrl}/tx/${transaction.hash}`
    );
};

updateRequestFuji().catch((e) => {
    console.error(e);
    process.exit(1);
});