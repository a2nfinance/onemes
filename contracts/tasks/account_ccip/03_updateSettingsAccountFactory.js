const { networks } = require("../../networks")

task("update-settings-account-factory", "update settings of AccountFactory.sol")
    .addParam("accountfactory", "address of AccountFactory.sol")
    .addParam("onemesnaming", "address of OneMesNaming.sol")
    .addParam("functionconsumer", "address of AutomatedFunctionsConsumer.sol")
    .setAction(async (taskArgs, hre) => {
        const { accountfactory, onemesnaming, functionconsumer } = taskArgs

        const ROUTER = networks[network.name].ccipRouter
        const LINK = networks[network.name].linkToken

        console.log("\n__Compiling Contracts__")
        await run("compile")

        console.log(`\nDeploying AccountFactory.sol to ${network.name}...`)
        const contractFactory = await ethers.getContractFactory("AccountFactory");
        const contract = await contractFactory.attach(accountfactory);
        const updateTx = await contract.updateSettings(
            ROUTER,
            LINK,
            onemesnaming,
            functionconsumer
        )
        await updateTx.wait(1)

        console.log(`\nAccountFactory contract is updated to ${network.name} at ${contract.address}`)
    })