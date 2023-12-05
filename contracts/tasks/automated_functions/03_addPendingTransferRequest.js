task("add-pending-request", "add pending transfer request").addParam("contractaddress", "address of AutomatedFunctionsConsumer.sol").setAction(async (taskArgs, hre) => {
    const {contractaddress} = taskArgs;
    console.log("\n__Compiling Contracts__")
    await run("compile")

    console.log(`\nAdd pending request to ${network.name}...`)
    const functionsFactory = await ethers.getContractFactory("AutomatedFunctionsConsumer");
    const functionsContract = await functionsFactory.attach(contractaddress);
    const sendTokensTx = await functionsContract.updatePendingTransferRequests(
        [[
            '6566facb8a63cfdcfb79f935',
            '0x928c4B85746B0d57DFF2031f98C9370B6C9e55cB',
            '0x7b2eb7cEA81Ea3E257dEEAefBE6B0F6A1b411042',
            '0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05',
            ethers.utils.parseUnits("0.0001", "18"),
            ethers.BigNumber.from("14767482510784806043")
        ]]
    )
    await sendTokensTx.wait()
    console.log("\nTx hash is ", sendTokensTx.hash)
})