task("check-settings-account", "check settings of Account.sol")
    .addParam("account", "address of Account.sol")
    .setAction(async (taskArgs, hre) => {
        const { account } = taskArgs
        const contractFactory = await ethers.getContractFactory("Account");
        const contract = await contractFactory.attach(account);
        const functionConsumer = await contract.functionConsumerAddress();
        const owner = await contract.owner();
        console.log(functionConsumer, owner);
        console.log(`\nAccount contract is checked at ${network.name} at ${contract.address}`)
    })