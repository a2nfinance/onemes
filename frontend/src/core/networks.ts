export const networks = {
    "43113": {
        accountFactory: process.env.NEXT_PUBLIC_FUJI_ACCOUNT_FACTORY,
        name: "fuji"
    },
    "11155111": {
        accountFactory: process.env.NEXT_PUBLIC_SEPOLIA_ACCOUNT_FACTORY,
        name: "sepolia"
    },
    "80001": {
        accountFactory: process.env.NEXT_PUBLIC_MUMBAI_ACCOUNT_FACTORY,
        name: "mumbai"
    },
}