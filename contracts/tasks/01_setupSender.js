const { networks } = require("../networks")

task("setup-sender", "deploy Account.sol").setAction(async (taskArgs, hre) => {
  if (network.name === "hardhat") {
    throw Error("This command cannot be used on a local development chain.  Specify a valid network.")
  }
  if (network.name !== "fuji") {
    throw Error("This task is intended to be executed on the Fuji network.")
  }

  const bnmToken = networks[network.name].bnmToken
  if (!bnmToken) {
    throw Error("Missing BNM Token Address")
  }

  const ROUTER = networks[network.name].router
  const LINK = networks[network.name].linkToken

  const TOKEN_TRANSFER_AMOUNT = "0.0001"
  const LINK_AMOUNT = "0.5"

  console.log("\n__Compiling Contracts__")
  await run("compile")

  console.log(`\nDeploying Sender.sol to ${network.name}...`)
  const senderFactory = await ethers.getContractFactory("Account")
  const senderContract = await senderFactory.deploy("lv.onemes", "levi@a2n.finance", "+84198765432", "@levi", "test", ROUTER, LINK, "0x7b2eb7cEA81Ea3E257dEEAefBE6B0F6A1b411042")
  await senderContract.deployTransaction.wait(1)

  console.log(`\nSender contract is deployed to ${network.name} at ${senderContract.address}`)

  // Fund with CCIP BnM Token
  console.log(`\nFunding ${senderContract.address} with ${TOKEN_TRANSFER_AMOUNT} CCIP-BnM `)
  const bnmTokenContract = await ethers.getContractAt(
    "@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
    bnmToken
  )

  const bnmTokenTx = await bnmTokenContract.transfer(
    senderContract.address,
    ethers.utils.parseUnits(TOKEN_TRANSFER_AMOUNT)
  )
  await bnmTokenTx.wait(1)

  const bnmTokenBal_baseUnits = await bnmTokenContract.balanceOf(senderContract.address)
  const bnmTokenBal = ethers.utils.formatUnits(bnmTokenBal_baseUnits.toString())
  console.log(`\nFunded ${senderContract.address} with ${bnmTokenBal} CCIP-BnM`)

  // Fund with LINK
  console.log(`\nFunding ${senderContract.address} with ${LINK_AMOUNT} LINK `)
  const LinkTokenFactory = await ethers.getContractFactory("LinkToken")
  const linkTokenContract = await LinkTokenFactory.attach(networks[network.name].linkToken)

  const linkTx = await linkTokenContract.transfer(senderContract.address, ethers.utils.parseUnits(LINK_AMOUNT))
  await linkTx.wait(1)

  const juelsBalance = await linkTokenContract.balanceOf(senderContract.address)
  const linkBalance = ethers.utils.formatEther(juelsBalance.toString())
  console.log(`\nFunded ${senderContract.address} with ${linkBalance} LINK`)
})