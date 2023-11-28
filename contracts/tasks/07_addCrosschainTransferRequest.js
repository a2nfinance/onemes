const { BigNumber } = require("ethers")

task("add-cross-chain-transfer-request", "add-cross-chain-transfer-request").setAction(async (taskArgs, hre) => {
    if (network.name === "hardhat") {
        throw Error("This command cannot be used on a local development chain.  Specify a valid network.")
    }
    if (network.name !== "fuji") {
        throw Error("This task is intended to be executed on the Fuji network.")
    }

    console.log("\n__Compiling Contracts__")
    await run("compile")

    console.log(`\nAdd pending request to ${network.name}...`)
    const functionsFactory = await ethers.getContractFactory("AutomatedFunctionsConsumer");
    const functionsContract = await functionsFactory.attach("0x4A7DCFe1C7B40770c033D62c6495b07dFb0f0bCA");

    const sendTokensTx = await functionsContract.updatePendingTransferRequest(
        "0x296C134d55Ae13eeab316605bceD8B04e36571D1",
        "0x8537ab2ae554F095fF33EB8be02640f6827eC616",
        // Link token address
        "0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4",
        1000000,
        new BigNumber.from("16015286601757825753")
    )
    await sendTokensTx.wait()
    console.log("\nTx hash is ", sendTokensTx.hash)
})