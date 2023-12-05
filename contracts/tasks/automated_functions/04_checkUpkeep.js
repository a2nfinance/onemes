
// const { networks } = require("../networks")

task("check-upkeep", "check-upkeep").addParam("contractaddress", "address of AutomatedFunctionConsumer.sol").setAction(async (taskArgs, hre) => {
    const { contractaddress } = taskArgs

    console.log("\n__Compiling Contracts__")
    await run("compile")

    console.log(`\nAdd pending request to ${network.name}...`)
    const functionsFactory = await ethers.getContractFactory("AutomatedFunctionsConsumer");
    const functionsContract = await functionsFactory.attach(contractaddress);

    const checkUnkeep = await functionsContract.checkUpkeep(
        "0x"
    )
    console.log(checkUnkeep);
})