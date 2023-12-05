const { networks } = require("../../networks")

task("setup-automated-consumer", "deploy AutomatedFunctionsConsumer.sol").setAction(async (taskArgs, hre) => {
  const routerAddress = networks[network.name].functionRouter
  console.log("\n__Compiling Contracts__")
  await run("compile")

  console.log(`\nDeploying AutomatedFunctionsConsumer.sol to ${network.name}...`)
  const functionsFactory = await ethers.getContractFactory("AutomatedFunctionsConsumer")
  const functionsContract = await functionsFactory.deploy(routerAddress)
  await functionsContract.deployTransaction.wait(1);

  console.log(`\nAutomated consumer contract is deployed to ${network.name} at ${functionsContract.address}`)
})