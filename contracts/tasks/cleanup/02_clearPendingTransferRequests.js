task("clear-pending-requests", "clear pending transfer requests").setAction(async (taskArgs, hre) => {
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
    const functionsContract = await functionsFactory.attach("0xa8080C7D771dc5B7a2e13E5803dAB0253BC145D5");

    const sendTokensTx = await functionsContract.clearPendingTransferRequests(
        
    )
    await sendTokensTx.wait()
    console.log("\nTx hash is ", sendTokensTx.hash)
})