// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC4671Delegate.sol";

contract EIPCreatorBadgeDelegate is ERC4671Delegate {
    constructor() ERC4671("EIP Creator Badge", "EIP") {}

    function revoke(uint256 tokenId) external {
        require(_isCreator(), "You must be the contract creator");
        _revoke(tokenId);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://eips.ethereum.org/ntt/";
    }
}
