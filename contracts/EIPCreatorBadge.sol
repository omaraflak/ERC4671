// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./NTTConsensus.sol";

contract EIPCreatorBadge is NTTConsensus {
    constructor(address[] memory voters) NTTConsensus("EIP Creator Badge", "EIP", voters) {}

    function giveThatManABadge(address owner) external {
        require(_isCreator(), "You must be the contract creator");
        _mint(owner);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://eips.ethereum.org/ntt/";
    }
}