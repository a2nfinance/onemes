// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IOneMesNaming {
    event CreateName();
    function createName(string memory name, address accountAddress) external returns (string memory);
    function getAddressByName(string memory name) external returns (address);
}