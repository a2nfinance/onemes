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

- OneMesNaming: [0x40cBEf3710a03420f0B900318131DE48Af25d8B6]()
- AccountFactory: [0x3a11b50ADA91e0Fd040BE69eCE7bBBc9D03CC3De]()
- AutomatedFunctionsConsumer: [0xe9F8a54e866e611088c77adCCE3068d79D8285B2]()
- Chainlink Subscription Id: 1341


### Ethereum sepolia

- OneMesNaming: [0xC6712deb00a2c23D60bD586892B9D7Bcabfcf2F2]()
- AccountFactory: [0x511077971BC2FdEcb62F7dBd19842b461CEA6560]()
- AutomatedFunctionsConsumer: [0xAa16E82f0d6a5f3Cd2042F23E57aDc508200153b]()
- Chainlink Subscription Id: 1772

### Polygon Mumbai

- OneMesNaming: [0xAa16E82f0d6a5f3Cd2042F23E57aDc508200153b]()
- AccountFactory: [0xDB1bE7A4D47427924f514c70BCf83E588A43aFDd]()
- AutomatedFunctionsConsumer: [0x511077971BC2FdEcb62F7dBd19842b461CEA6560]()
- Chainlink Subscription Id: 1041

