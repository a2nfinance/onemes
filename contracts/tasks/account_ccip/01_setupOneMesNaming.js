task("setup-onemes-naming", "deploy OneMesNaming.sol").setAction(async (taskArgs, hre) => {

    console.log("\n__Compiling Contracts__")
    await run("compile")

    console.log(`\nDeploying OneMesNaming.sol to ${network.name}...`)
    const senderFactory = await ethers.getContractFactory("OneMesNaming")
    const senderContract = await senderFactory.deploy()
    await senderContract.deployTransaction.wait(1)

    console.log(`\nSender contract is deployed to ${network.name} at ${senderContract.address}`)
})