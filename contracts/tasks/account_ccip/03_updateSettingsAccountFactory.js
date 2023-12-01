const { networks } = require("../../networks")

task("update-settings-account-factory", "update settings of AccountFactory.sol")
    .addParam("accountfactory", "address of AccountFactory.sol")
    .addParam("onemesnaming", "address of OneMesNaming.sol")
    .setAction(async (taskArgs, hre) => {
        const { accountfactory, onemesnaming } = taskArgs
        if (network.name === "hardhat") {
            throw Error("This command cannot be used on a local development chain.  Specify a valid network.")
        }
        if (network.name !== "fuji") {
            throw Error("This task is intended to be executed on the Fuji network.")
        }

        const ROUTER = networks[network.name].router
        const LINK = networks[network.name].linkToken

        console.log("\n__Compiling Contracts__")
        await run("compile")

        console.log(`\nDeploying AccountFactory.sol to ${network.name}...`)
        const contractFactory = await ethers.getContractFactory("AccountFactory");
        const contract = await contractFactory.attach(accountfactory);
        const updateTx = await contract.updateSettings(
            ROUTER,
            LINK,
            onemesnaming
        )
        await updateTx.wait(1)

        console.log(`\nAccountFactory contract is updated to ${network.name} at ${contract.address}`)
    })