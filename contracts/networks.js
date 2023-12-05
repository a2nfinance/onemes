// All supported networks and related contract addresses are defined here.
//
// LINK token addresses: https://docs.chain.link/resources/link-token-contracts/
// Price feeds addresses: https://docs.chain.link/data-feeds/price-feeds/addresses
// Chain IDs: https://chainlist.org/?testnets=true

require("@chainlink/env-enc").config()

const DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS = 2

const npmCommand = process.env.npm_lifecycle_event
const isTestEnvironment = npmCommand == "test" || npmCommand == "test:unit"

// Set EVM private key (required)
const PRIVATE_KEY = process.env.PRIVATE_KEY

if (!isTestEnvironment && !PRIVATE_KEY) {
  throw Error("Set the PRIVATE_KEY environment variable with your EVM wallet private key")
}

const networks = {
  sepolia: {
    url: process.env.SEPOLIA_RPC_URL || "THIS HAS NOT BEEN SET",
    gasPrice: undefined,
    ccipRouter: "0xd0daae2231e9cb96b94c8512223533293c3693bf",
    functionRouter: "0xb83E47C2bC239B3bf370bc41e1459A34b41238D0",
    chainSelector: "16015286601757825753",
    accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    verifyApiKey:  process.env.SEPOLIA_VERIFY_API_KEY,
    chainId: 11155111,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "ETH",
    linkToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    bnmToken: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05", // LINK/SEPOLIA-ETH
    donId: "fun-ethereum-sepolia-1",
    explorerUrl: "https://sepolia.etherscan.io",
    rpcUrl: "https://rpc.sepolia.org"
  },
  fuji: {
    url: process.env.AVALANCHE_FUJI_RPC_URL || "THIS HAS NOT BEEN SET",
    ccipRouter: "0x554472a2720e5e7d5d3c817529aba05eed5f82d8",
    functionRouter: "0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0",
    chainSelector: "14767482510784806043",
    gasPrice: undefined,
    accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    verifyApiKey: "THIS HAS NOT BEEN SET",
    chainId: 43113,
    confirmations: 2 * DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "AVAX",
    linkToken: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
    bnmToken: "0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4",
    donId: "fun-avalanche-fuji-1",
    explorerUrl: "https://testnet.avascan.info",
    rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc"
  },
  mumbai: {
    url: process.env.MUMBAI_RPC_URL || "THIS HAS NOT BEEN SET",
    ccipRouter: "0x70499c328e1e2a3c41108bd3730f6670a44595d1",
    functionRouter: "0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C",
    chainSelector: "12532609583862916517",
    gasPrice: undefined,
    accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    verifyApiKey: process.env.MUMBAI_VERIFY_API_KEY,
    chainId: 80001,
    confirmations: 2 * DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "MATIC",
    linkToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    bnmToken: "0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40",
    donId: "fun-polygon-mumbai-1",
    explorerUrl: "https://mumbai.polygonscan.com/",
    rpcUrl: "https://rpc-mumbai.maticvigil.com"
  },
}

module.exports = {
  networks,
}