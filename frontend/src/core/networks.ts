export const networks = {
    "43113": {
        accountFactory: process.env.NEXT_PUBLIC_FUJI_ACCOUNT_FACTORY,
        name: "fuji",
        nativeToken: "avax",
        explorerUrl: "https://testnet.snowtrace.io",
    },
    "11155111": {
        accountFactory: process.env.NEXT_PUBLIC_SEPOLIA_ACCOUNT_FACTORY,
        name: "sepolia",
        nativeToken: "SepoliaETH",
        explorerUrl: "https://sepolia.etherscan.io",
    },
    "80001": {
        accountFactory: process.env.NEXT_PUBLIC_MUMBAI_ACCOUNT_FACTORY,
        name: "mumbai",
        nativeToken: "matic",
        explorerUrl: "https://mumbai.polygonscan.com/",
    },
}

export const chainSelectors = [
    {name: "fuji", chainSelector: "14767482510784806043"},
    {name: "mumbai", chainSelector: "12532609583862916517"},
    {name: "sepolia", chainSelector: "16015286601757825753"}
]

export const chainIds = {
    "fuji": 43113,
    "sepolia": 11155111,
    "mumbai": 80001
}

export const nativeTokenAddress = "0x0000000000000000000000000000000000000000";