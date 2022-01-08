// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

interface INTT is IERC165 {
    /// @notice Count all NTTs assigned to an owner
    /// @param owner Address for whom to query the balance
    /// @return Number of NTTs owned by `owner`
    function balanceOf(address owner) external view returns (uint256);

    /// @notice Check if a NTT is hasn't been invalidated
    /// @param owner Address for whom to check the NTT validity
    /// @param index Index of the NTT
    /// @return True if the NTT is valid, False otherwise
    function isValid(address owner, uint256 index) external view returns (bool);
}