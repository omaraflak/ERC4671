// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./NTTDelegate.sol";

contract EIPCreatorBadge is NTTDelegate {
    constructor() NTT("EIP Creator Badge", "EIP2") {}

    function giveThatManABadge(address owner) external {
        require(_isCreator(), "You must be the contract creator");
        _mint(owner);
    }

    function invalidate(address owner, uint256 index) external {
        require(_isCreator(), "You must be the contract creator");
        _invalidate(owner, index);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://eips.ethereum.org/ntt/";
    }
}