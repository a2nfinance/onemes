export const getSepoliaTransactionHistory = async (address: string) => {
    const req = await fetch(`https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${process.env.S54PAF6BM31ZB7TB6VWX28NTF6KFC287VY}`);
    const res = await req.json();
    const transactions = res.result.map(r => ({ status: res.status === "1" ? true : false, id: r.hash, value: r.value }))
    return transactions;
}