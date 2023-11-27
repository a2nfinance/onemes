task("set-upkeep-contract", "set-upkeep-contract").setAction(async (taskArgs, hre) => {
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
    const functionsContract = await functionsFactory.attach("0x9d3F404Cbc56Aba38ced29E05Ee50ea040b9269b");

    const setUnkeepTx = await functionsContract.setAutomationCronContract(
        "0x9d3F404Cbc56Aba38ced29E05Ee50ea040b9269b"
    )
    await setUnkeepTx.wait();
    console.log("\nTx hash is ", setUnkeepTx.hash);
})