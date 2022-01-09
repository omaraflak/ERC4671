// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./NTT.sol";

contract ChamechaudeBadge is NTT {
    constructor() NTT("Chamechaude Badge", "CMC") {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://chamechaude-badge.com/api/";
    }
}