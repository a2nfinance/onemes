export const networks = {
    "43113": {
        accountFactory: process.env.NEXT_PUBLIC_FUJI_ACCOUNT_FACTORY,
        name: "fuji",
        nativeToken: "avax"
    },
    "11155111": {
        accountFactory: process.env.NEXT_PUBLIC_SEPOLIA_ACCOUNT_FACTORY,
        name: "sepolia",
        nativeToken: "SepoliaETH"
    },
    "80001": {
        accountFactory: process.env.NEXT_PUBLIC_MUMBAI_ACCOUNT_FACTORY,
        name: "mumbai",
        nativeToken: "matic"
    },
}

export const chainSelectors = [
    {name: "fuji", chainSelector: "14767482510784806043"},
    {name: "mumbai", chainSelector: "12532609583862916517"},
    {name: "sepolia", chainSelector: "16015286601757825753"}
]

export const nativeTokenAddress = "0x0000000000000000000000000000000000000000";