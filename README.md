# Simple Summary

A standard interface for non-tradable tokens.

# Abstract

The following standard allows for the implementation of a standard API for NTTs within smart contracts.

NTTs represent inherently personal possessions (material or immaterial), such as school diplomas, online training certificates, government issued documents (national id, driving licence, visa, etc.), services (insurance, ...), proof of address, proof of ownership, and so on.

NTTs are non-tradable and non-fungible, they are unique and they belong to you.

# Specification

<!-- AUTO-GENERATED-CONTENT:START (CODE:syntax=solidity&src=./contracts/INTT.sol) -->
<!-- The below code snippet is automatically added from ./contracts/INTT.sol -->
```solidity
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
```
<!-- AUTO-GENERATED-CONTENT:END -->

## Extensions

### Metadata

<!-- AUTO-GENERATED-CONTENT:START (CODE:syntax=solidity&src=./contracts/INTTMetadata.sol) -->
<!-- The below code snippet is automatically added from ./contracts/INTTMetadata.sol -->
```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface INTTMetadata {
    /// @return Descriptive name of the NTTs in this contract
    function name() external view returns (string memory);

    /// @return An abbreviated name of the NTTs in this contract
    function symbol() external view returns (string memory);

    /// @notice Fetch API link containing information for an NTT
    /// @param owner Address of the NTT's owner
    /// @param index Index of the NTT
    /// @return API link to query for the NTT
    function uri(address owner, uint256 index) external view returns (string memory);
}
```
<!-- AUTO-GENERATED-CONTENT:END -->

### Delegation

<!-- AUTO-GENERATED-CONTENT:START (CODE:syntax=solidity&src=./contracts/INTTDelegate.sol) -->
<!-- The below code snippet is automatically added from ./contracts/INTTDelegate.sol -->
```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface INTTDelegate {
    /// @notice Grant one-time minting right to `operator` for `owner`
    /// An allowed operator can call the function to transfer rights.
    /// @param operator Address allowed to mint
    /// @param owner Address for whom `operator` is allowed to mint
    function delegate(address operator, address owner) external;

    /// @notice Mint a NTT
    /// @param owner Address for whom the NTT is minted
    function mint(address owner) external;
}
```
<!-- AUTO-GENERATED-CONTENT:END -->