const ethers = require("ethers");
const cron = require('node-cron');
const json = require("./abi/AutomatedFunctionsConsumer.json");
require("dotenv").config();
var contract = null;
const initContract = async () => {
    try {
        const network = process.env.FUJI_RPC;
        const provider = ethers.getDefaultProvider(network);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const factory = new ethers.ContractFactory(json.abi, json.bytecode, wallet)
        contract = factory.attach(process.env.CONTRACT_ADDRESS);
    } catch (e) {
        console.log(e);
    }

}
initContract();
cron.schedule('*/5 * * * * *', () => {
    if (contract) {
        console.log('running a task every two second');
    }

});