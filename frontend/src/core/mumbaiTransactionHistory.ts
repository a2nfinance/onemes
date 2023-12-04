export const getMumbaiTransactionHistory = async (address: string) => {
   const req = await fetch(`https://api-testnet.polygonscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${process.env.VZMHT2G2WAD3ECVN2Q9GVAX8S9JAA52X3Y}`);
   const res = await req.json();
   const transactions = res.result.map(r => ({status: res.status === "1" ? true : false, id: r.hash, value: r.value}))
   return transactions;
}