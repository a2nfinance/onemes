
## Utilizing Chainlink technologies
- The smart contract utilizes Chainlink Automation & Chainlink Functions: [AutomatedFunctionsConsumer](./contracts/AutomatedFunctionsConsumer.sol)
- The smart contract utilizes Chainlink CCIP: [AA contract](./contracts/Account.sol)
## Chainlink Upkeeps & Subscriptions

|       | Upkeep | Subscription ID |
| ----------- | ----------- | ----------- |
| Fuji      | [OneMesAutomation](https://automation.chain.link/fuji/61504467352864847866059257735594565277523012734929227536507449225656815283735)       | [1341](https://functions.chain.link/fuji/1341)       |
| Sepolia   | [OneMesAutomation](https://automation.chain.link/sepolia/81365215342390125962390398083203136207330687003379133868714111124871906824075)        | [1772](https://functions.chain.link/sepolia/1772) |
| Mumbai   | [OneMesAutomation](https://automation.chain.link/mumbai/69784010374303131921254565902671541714693990388738570456012229349744781596791)        | [1041](https://functions.chain.link/mumbai/1041) |
## Contract addresses

|      | AutomatedFunctionsConsumer.sol | AccountFactory.sol | OneMesNaming.sol |
| ----------- | ----------- | ----------- | ----------- |
| Fuji | [0xCCDCa49Ad92dEf73086Da6C2764423244E014283]() | [0x495A7D42F489b5E72034719cF2CeC262E8b5a1e3]() |  [0xF71363E8dAdEFfBA0C3eE4e26d8Db257c35CB7AE]() |
| Sepolia | [0x4A7DCFe1C7B40770c033D62c6495b07dFb0f0bCA]() | [0xE4E4F631a30afa57D966255f254365C51b70F1C0]() | [0x7CC6e9B08Fd0300bfE933da7E2C1046C29cbA0e6]() |
| Mumbai | [0x42ec2Adc09D713133386dFCC9b1Af9c560Fa814f]() | [0x606d8EF65f243CAaC6faF739650CDaa5F6160f5d]() | [0x05CF0F6cB2F26CF94e3f9e39AfB5632C38D3d6c0]() |
## How to deploy contracts from scratch

### Steps to deploy
- Deploy & Verify OneMesNaming.sol
    - Use: ```npx hardhat setup-onemes-naming  --network {network name} --show-stack-traces ```
- Deploy & Verify AutomatedFunctionsConsumer.sol
    - Use: ```npx hardhat setup-automated-consumer  --network {network name} --show-stack-traces ```
- Deploy & Verify AccountFactory.sol
    - Use: ```npx hardhat setup-account-factory --network {network name} --show-stack-traces```
- Update AccountFactory.sol settings.
    - Update settings: ```npx hardhat update-settings-account-factory --network sepolia --accountfactory {AccountFactory contract address} --onemesnaming {OneMesNaming contract address} --functionconsumer {AutomatedFunctionConsumer contract address}  --show-stack-traces```
- Update Request Post API for AutomatedFunctionConsumer
    - Use: ```npx hardhat update-function-api --network sepolia --consumeraddress {AutomatedFunctionConsumer contract address} --subscriptionid {your chainlink subscription id}  --show-stack-traces```
### Integrate with Chainlink
- Register a Chainlink upkeep
- Create a Chainlink subscription ID and add consumer.

Do that on three chains: Fuji, Ehereum Sepolia, and Mumbai.
