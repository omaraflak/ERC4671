// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./INTT.sol";

interface INTTConsensus is INTT {
    /// @notice Get voters addresses for this consensus contract
    /// @return Addresses of the voters
    function voters() external view returns (address[] memory);

    /// @notice Cast a vote to mint a token for a specific address
    /// @param owner Address for whom to mint the token
    function approveMint(address owner) external;

    /// @notice Cast a vote to invalidate a specific token
    /// @param tokenId Identifier of the token to invalidate
    function approveInvalidate(uint256 tokenId) external;
}