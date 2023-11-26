
const { ethers } = require("ethers");

let abiCoder = new ethers.utils.AbiCoder();
let encodedString = abiCoder.encode(["tuple(uint256 b, string c)[] d"], [[{b: 5678, c: "Hello men"}, {b: 1, c: "Ok"}]]);

console.log(encodedString);

let decodeString = abiCoder.decode(["tuple(uint256 b, string c)[] d"], encodedString);

console.log(decodeString);