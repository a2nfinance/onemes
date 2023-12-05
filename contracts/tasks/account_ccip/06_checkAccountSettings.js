const { networks } = require("../../networks")

task("check-settings-account", "check settings of Account.sol")
    .addParam("account", "address of Account.sol")
    .setAction(async (taskArgs, hre) => {
        const { account } = taskArgs
        const contractFactory = await ethers.getContractFactory("Account");
        const contract = await contractFactory.attach(account);
        const functionConsumer = await contract.functionConsumerAddress();
        const owner = await contract.owner();
        console.log(functionConsumer, owner);
        // const updateTx = await contract.updateFunctionConsumerAddress(
        //    "0xD01715c9E1b17617686f663d6738Ea2519628b2e"
        // )
        // await updateTx.wait(1)
//c7e93ab7aa346e49d2d7cfb0c9ef343fb5807bc063ea1b071d0cd793e8765279
//66e0d55bf49fc2af2756d68f89d8c77a5f1883d31cb8030d23d9ec40a544922e
        console.log(`\nAccount contract is checked at ${network.name} at ${contract.address}`)
    })