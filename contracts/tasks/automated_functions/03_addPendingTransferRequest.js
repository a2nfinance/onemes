task("add-pending-request", "add pending transfer request").setAction(async (taskArgs, hre) => {
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
    const functionsContract = await functionsFactory.attach("0x63B8F59B7d99C1e36cb26E5cC89F3216C8f417b1");

    const sendTokensTx = await functionsContract.updatePendingTransferRequests(
        [[
            '6566facb8a63cfdcfb79f935',
            '0x296C134d55Ae13eeab316605bceD8B04e36571D1',
            '0x8537ab2ae554F095fF33EB8be02640f6827eC616',
            '0xd21341536c5cf5eb1bcb58f6723ce26e8d8e90e4',
            ethers.utils.parseUnits("0.0001", "18"),
            ethers.BigNumber.from("16015286601757825753")
        ]]
    )
    await sendTokensTx.wait()
    console.log("\nTx hash is ", sendTokensTx.hash)
})