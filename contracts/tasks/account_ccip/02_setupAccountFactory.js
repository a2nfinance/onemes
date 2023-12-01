task("setup-account-factory", "deploy AccountFactory.sol").setAction(async (taskArgs, hre) => {
  if (network.name === "hardhat") {
      throw Error("This command cannot be used on a local development chain.  Specify a valid network.")
  }
  if (network.name !== "fuji") {
      throw Error("This task is intended to be executed on the Fuji network.")
  }

  console.log("\n__Compiling Contracts__")
  await run("compile")

  console.log(`\nDeploying AccountFactory.sol to ${network.name}...`)
  const contractFactory = await ethers.getContractFactory("AccountFactory")
  const accountFactoryContract = await contractFactory.deploy()
  await accountFactoryContract.deployTransaction.wait(1)

  console.log(`\nAccountFactory contract is deployed to ${network.name} at ${accountFactoryContract.address}`)
})