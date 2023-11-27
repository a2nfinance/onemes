const { networks } = require("../networks")

task("setup-automated-consumer", "deploy AutomatedFunctionsConsumer.sol").setAction(async (taskArgs, hre) => {
  if (network.name === "hardhat") {
    throw Error("This command cannot be used on a local development chain.  Specify a valid network.")
  }
  if (network.name !== "fuji") {
    throw Error("This task is intended to be executed on the Fuji network.")
  }

  console.log("\n__Compiling Contracts__")
  await run("compile")

  console.log(`\nDeploying Sender.sol to ${network.name}...`)
  const functionsFactory = await ethers.getContractFactory("AutomatedFunctionsConsumer")
  const functionsContract = await functionsFactory.deploy("0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0")
  await functionsContract.deployTransaction.wait(1);

  console.log(`\nAutomated consumer contract is deployed to ${network.name} at ${functionsContract.address}`)
})