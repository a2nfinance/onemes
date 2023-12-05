task("delete-pending-request", "delete a pending transfer request").addParam("contractaddress", "address of AutomatedFunctionsConsumer.sol").setAction(async (taskArgs, hre) => {
    const {contractaddress} = taskArgs;
    console.log("\n__Compiling Contracts__")
    await run("compile")

    console.log(`\nAdd pending request to ${network.name}...`)
    const functionsFactory = await ethers.getContractFactory("AutomatedFunctionsConsumer");
    const functionsContract = await functionsFactory.attach(contractaddress);

    const sendTokensTx = await functionsContract.deletePendingTransferRequest(
        0
    )
    await sendTokensTx.wait()
    console.log("\nTx hash is ", sendTokensTx.hash)
})