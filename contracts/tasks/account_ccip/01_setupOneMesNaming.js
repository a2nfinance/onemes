task("setup-onemes-naming", "deploy OneMesNaming.sol").setAction(async (taskArgs, hre) => {
    if (network.name === "hardhat") {
        throw Error("This command cannot be used on a local development chain.  Specify a valid network.")
    }
    if (network.name !== "fuji") {
        throw Error("This task is intended to be executed on the Fuji network.")
    }

    console.log("\n__Compiling Contracts__")
    await run("compile")

    console.log(`\nDeploying OneMesNaming.sol to ${network.name}...`)
    const senderFactory = await ethers.getContractFactory("OneMesNaming")
    const senderContract = await senderFactory.deploy()
    await senderContract.deployTransaction.wait(1)

    console.log(`\nSender contract is deployed to ${network.name} at ${senderContract.address}`)
})