// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

interface INTT is IERC165 {
    /// @notice Count all tokens assigned to an owner
    /// @param owner Address for whom to query the balance
    /// @return Number of tokens owned by `owner`
    function balanceOf(address owner) external view returns (uint256);

    /// @notice Check if a token hasn't been invalidated
    /// @param owner Address for whom to check the token validity
    /// @param index Index of the token
    /// @return True if the token is valid, False otherwise
    function isValid(address owner, uint256 index) external view returns (bool);

    /// @notice Get the issuer of a token
    /// @param owner Address for whom to check the token issuer
    /// @param owner Index of the token
    /// @return Address of the issuer
    function issuerOf(address owner, uint256 index) external view returns (address);
}