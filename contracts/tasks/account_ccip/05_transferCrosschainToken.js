const { networks } = require("../../networks")

task("transfer-token", "transfers token x-chain from Account.sol to another address")
  .addParam("sender", "address of Account.sol")
  .addParam("reciever", "address of the reciever")
  .addParam("dest", "destination chain as specified in networks.js file")
  .addParam("amount", "token amount to transfer in expressed in smallest denomination (eg juels, wei)")
  .setAction(async (taskArgs, hre) => {
    if (network.name === "hardhat") {
      throw Error("This command cannot be used on a local development chain.  Specify a valid network.")
    }

    if (network.name !== "fuji") {
      throw Error("This task is intended to be executed on the Fuji network.")
    }

    let bnmTokenAddress = networks[network.name].bnmToken
    if (!bnmTokenAddress) {
      throw Error("Missing BnM Token Address from networks.js file")
    }

    let { sender, reciever, dest, amount } = taskArgs

    let destChainSelector = networks[dest].chainSelector

    const senderFactory = await ethers.getContractFactory("Account");
    const senderContract = await senderFactory.attach(sender)

    const sendTokensTx = await senderContract.transferTokensPayLink(reciever, bnmTokenAddress, amount, destChainSelector)
    await sendTokensTx.wait()
    console.log("\nTx hash is ", sendTokensTx.hash)

    console.log(`\nPlease visit the CCIP Explorer at 'https://ccip.chain.link' and paste in the Tx Hash '${sendTokensTx.hash}' to view the status of your CCIP tx.
    Be sure to make a note of your Message Id for use in the next steps.`)
  })