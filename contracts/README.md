## Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```
---
npx hardhat transfer-token --network fuji --amount 100000000000 --sender 0x296C134d55Ae13eeab316605bceD8B04e36571D1 --reciever 0x8537ab2ae554F095fF33EB8be02640f6827eC616 --dest sepolia
---

## Contract addresses
### Create chainlink subscription Id
- Sepolia
- Mumbai
- AvalancheFuji
### Step to deploy
- Deploy & Verify OneMesNaming.sol
    - Use: ```npx hardhat setup-onemes-naming  --network {network name} --show-stack-traces ```
- Deploy & Verify AutomatedFunctionsConsumer.sol
    - Use: ```npx hardhat setup-automated-consumer  --network {network name} --show-stack-traces ```
- Deploy & Verify AccountFactory.sol
    - Use: ```npx hardhat setup-account-factory --network {network name} --show-stack-traces```
- Update AccountFactory.sol settings.
    - Update settings: ```npx hardhat update-settings-account-factory --network sepolia --accountfactory {AccountFactory contract address} --onemesnaming {OneMesNaming contract address} --functionconsumer {AutomatedFunctionConsumer contract address}  --show-stack-traces```
- Update Request Post API for AutomatedFunctionConsumer
    - Use: ```npx hardhat update-function-api --network sepolia --consumeraddress {AutomatedFunctionConsumer contract address} --subscriptionid {your chainlink subscription id}  --show-stack-traces ```

### Avalanche Fuji

- OneMesNaming: [0xF71363E8dAdEFfBA0C3eE4e26d8Db257c35CB7AE]()
- AccountFactory: [0x495A7D42F489b5E72034719cF2CeC262E8b5a1e3]()
- AutomatedFunctionsConsumer: [0xCCDCa49Ad92dEf73086Da6C2764423244E014283]()
- Chainlink Subscription Id: 1341


### Ethereum sepolia

- OneMesNaming: [0x7CC6e9B08Fd0300bfE933da7E2C1046C29cbA0e6]()
- AccountFactory: [0xE4E4F631a30afa57D966255f254365C51b70F1C0]()
- AutomatedFunctionsConsumer: [0x4A7DCFe1C7B40770c033D62c6495b07dFb0f0bCA]()
- Chainlink Subscription Id: 1772

### Polygon Mumbai

- OneMesNaming: [0x05CF0F6cB2F26CF94e3f9e39AfB5632C38D3d6c0]()
- AccountFactory: [0x606d8EF65f243CAaC6faF739650CDaa5F6160f5d]()
- AutomatedFunctionsConsumer: [0x42ec2Adc09D713133386dFCC9b1Af9c560Fa814f]()
- Chainlink Subscription Id: 1041

