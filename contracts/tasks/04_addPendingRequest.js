task("add-pending-request", "add pending transfer request").setAction(async (taskArgs, hre) => {
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
    const functionsContract = await functionsFactory.attach("0xAB1EFb988201fA3E8a7e0A362953BF0d0A96866e");

    const setUnkeepTx = await functionsContract.setAutomationCronContract(
        "0x9d3F404Cbc56Aba38ced29E05Ee50ea040b9269b"
    )
    await setUnkeepTx.wait()
    console.log("\nTx hash is ", setUnkeepTx.hash)

    const sendTokensTx = await functionsContract.updatePendingTransferRequest(
        "0x296C134d55Ae13eeab316605bceD8B04e36571D1",
        "0x8537ab2ae554F095fF33EB8be02640f6827eC616",
        // Link token address
        "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
        100000000000000,
        0
    )
    await sendTokensTx.wait()
    console.log("\nTx hash is ", sendTokensTx.hash)
})