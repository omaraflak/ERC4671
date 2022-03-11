// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC4671Pull.sol";

contract EIPCreatorBadge is ERC4671Pull {
    constructor() ERC4671("EIP Creator Badge", "EIP") {}

    function giveThatManABadge(address owner) external {
        require(_isCreator(), "You must be the contract creator");
        _mint(owner);
    }

    function revoke(uint256 tokenId) external {
        require(_isCreator(), "You must be the contract creator");
        _revoke(tokenId);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://eips.ethereum.org/ntt/";
    }
}
