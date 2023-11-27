
// const { networks } = require("../networks")

task("check-unkeep", "check-unkeep").setAction(async (taskArgs, hre) => {
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

    const checkUnkeep = await functionsContract.checkUpkeep(
        "0x"
    )
    console.log(checkUnkeep);
})