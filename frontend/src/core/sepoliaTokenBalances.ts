// Setup: npm install alchemy-sdk
import { Alchemy, Network } from "alchemy-sdk";

const config = {
  apiKey: process.env.NEXT_PUBLIC_ACHEMY_KEY_SEPOLIA,
  network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(config);

export const getSepoliaAccountBalances = async (address: string) => {

  // Get token balances
  const balances = await alchemy.core.getTokenBalances(address);

  // Remove tokens with zero balance
  const nonZeroBalances = balances.tokenBalances.filter((token) => {
    return token.tokenBalance !== "0";
  });

  console.log(`Token balances of ${address} \n`);

  // Counter for SNo of final output
  let i = 1;
  let tokenBalances: { tokenName: string, tokenSymbol: string, tokenQuantity: string }[] = [];
  // Loop through all tokens with non-zero balance
  for (let token of nonZeroBalances) {
    // Get balance of token
    let balance = token.tokenBalance;

    // Get metadata of token
    const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);

    // Compute token balance in human-readable format
    // balance = ethers.utils.formatUnits(balance, metadata.decimals);

    tokenBalances.push({
      tokenName: metadata.name,
      tokenSymbol: metadata.symbol,
      tokenQuantity: balance
    })

    // Print name, balance, and symbol of token
    // console.log(`${i++}. ${metadata.name}: ${balance} ${metadata.symbol}`);

  }

  return tokenBalances;
};