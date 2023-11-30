task("delete-pending-request", "delete a pending transfer request").setAction(async (taskArgs, hre) => {
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
    const functionsContract = await functionsFactory.attach("0x63B8F59B7d99C1e36cb26E5cC89F3216C8f417b1");

    const sendTokensTx = await functionsContract.deletePendingTransferRequest(
        0
    )
    await sendTokensTx.wait()
    console.log("\nTx hash is ", sendTokensTx.hash)
})