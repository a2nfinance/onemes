
task("create-account", "deploy Account.sol")
  .addParam("accountfactory", "address of AccountFactory.sol")
  .addParam("name", "name")
  .addParam("email", "email")
  .addParam("phonenumber", "name")
  .addParam("twitter", "name")
  .addParam("telegram", "name")
  .addParam("usewalletaddresstoreceive", "use_wallet_address_to_receive")
  .setAction(async (taskArgs, hre) => {
    const { accountfactory, name, email, phonenumber, twitter, telegram, use_wallet_address_to_receive } = taskArgs;
    console.log("\n__Compiling Contracts__")
    await run("compile")

    console.log(`\nCreate new Account.sol to ${network.name}...`)
    const contractFactory = await ethers.getContractFactory("AccountFactory")
    const contract = await contractFactory.attach(accountfactory)
    const createAccountTx = await contract.createAccount(
      [
        name,
        email,
        phonenumber,
        twitter,
        telegram,
        use_wallet_address_to_receive
      ]
    )
    await createAccountTx.wait(1)

    console.log(`\nSender contract is deployed to ${network.name} at ${contract.address} with transaction hash ${createAccountTx.hash}`)

  })