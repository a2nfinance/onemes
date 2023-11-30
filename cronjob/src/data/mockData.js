// Syntax to transfer tokens on the same chain: TR TOKEN_NAME AMOUNT RECEIVER.
// Syntax to transfer between different chains: CTR SOURCE_CHAIN TOKEN_NAME AMOUNT DESTINATION_CHAIN RECEIVER.

const mockRequests = [
  // {
  //   _id: '6565b6829083d9c03a92230f',
  //   sender: '+84918760432',
  //   type: 1,
  //   message: 'TR avax 0.00001 @john',
  //   status: 0,
  //   created_at: '2023-11-28T09:44:34.573Z',
  //   __v: 0
  // },
  {
    _id: '6566facb8a63cfdcfb79f935',
    sender: '+84918760432',
    type: 1,
    message: 'CTR fuji CCIP-BnM 0.00000001 sepolia @john',
    status: 0,
    created_at: '2023-11-28T09:44:34.573Z',
    __v: 0
  }
]

const mockAccounts = [
  {
    _id: '6565b6829083d9c03a92230f',
    wallet_address: '0x7b2eb7cEA81Ea3E257dEEAefBE6B0F6A1b411042',
    onemes_name: "levi.onemes",
    onemes_account_address: "0x296C134d55Ae13eeab316605bceD8B04e36571D1", //"0x9e43Ebec8af0a734100c5D3714A4fdC6C16D9665"
    email: 'levi@a2n.finance',
    phone_number: '+84918760432',
    twitter: '@levi',
    telegram: '12345566',
    use_wallet_address_to_receive: true,
    status: 1,
    created_at: '2023-11-28T09:44:34.573Z',
    __v: 0
  },
  {
    _id: '6565b6829083d9c03a92230f',
    wallet_address: '0x8537ab2ae554F095fF33EB8be02640f6827eC616',
    onemes_name: "john.onemes",
    onemes_account_address: "0x9e43Ebec8af0a734100c5D3714A4fdC6C16D9665",
    network: 1,
    email: 'john@a2n.finance',
    phone_number: '+84915273032',
    twitter: '@john',
    telegram: '12345566',
    use_wallet_address_to_receive: true,
    status: 1,
    created_at: '2023-11-28T09:44:34.573Z',
    __v: 0
  },
]

module.exports = { mockAccounts, mockRequests }