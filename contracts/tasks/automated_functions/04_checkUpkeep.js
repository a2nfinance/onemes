
// const { networks } = require("../networks")

task("check-upkeep", "check-upkeep").setAction(async (taskArgs, hre) => {
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
    const functionsContract = await functionsFactory.attach("0xe9F8a54e866e611088c77adCCE3068d79D8285B2");

    const checkUnkeep = await functionsContract.checkUpkeep(
        "0x"
    )
    console.log(checkUnkeep);
})