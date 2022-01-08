# Non-Tradable Token Standard

| <!-- -->       | <!-- -->                                        |
|----------------|-------------------------------------------------|
| Author         | Omar Aflak                                      |
| Discussions-To | https://github.com/ethereum/eips/issues/#number |
| Status         | Draft                                           |
| Type           | Standards Track                                 |
| Category       | ERC                                             |
| Created        | 2022-01-05                                      |
| Requires       | [165](https://eips.ethereum.org/EIPS/eip-165)   |

<!-- AUTO-GENERATED-CONTENT:START (TOC) -->
- [Simple Summary](#simple-summary)
- [Abstract](#abstract)
- [Specification](#specification)
  - [Extensions](#extensions)
    - [Metadata](#metadata)
    - [Delegation](#delegation)
<!-- AUTO-GENERATED-CONTENT:END -->

## Simple Summary

A standard interface for non-tradable tokens.

## Abstract

NTTs represent inherently personal possessions (material or immaterial), such as school diplomas, online training certificates, government issued documents (national id, driving licence, visa, etc.), home address, badges, and so on.

NTTs are non-tradable and non-fungible tokens, they are unique and they belong to you.

<u>**NTTs are proofs of possession**</u>.

## Specification

<!-- AUTO-GENERATED-CONTENT:START (CODE:syntax=solidity&src=./contracts/INTT.sol) -->
<!-- The below code snippet is automatically added from ./contracts/INTT.sol -->
```solidity
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
```
<!-- AUTO-GENERATED-CONTENT:END -->

### Extensions

#### Metadata

<!-- AUTO-GENERATED-CONTENT:START (CODE:syntax=solidity&src=./contracts/INTTMetadata.sol) -->
<!-- The below code snippet is automatically added from ./contracts/INTTMetadata.sol -->
```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface INTTMetadata {
    /// @return Descriptive name of the tokens in this contract
    function name() external view returns (string memory);

    /// @return An abbreviated name of the tokens in this contract
    function symbol() external view returns (string memory);

    /// @notice Fetch API link containing information for a token
    /// @param owner Address of the token's owner
    /// @param index Index of the token
    /// @return API link to query for the token's data
    function uri(address owner, uint256 index) external view returns (string memory);
}
```
<!-- AUTO-GENERATED-CONTENT:END -->

#### Delegation

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

    /// @notice Mint a token
    /// @param owner Address for whom the token is minted
    function mint(address owner) external;
}
```
<!-- AUTO-GENERATED-CONTENT:END -->