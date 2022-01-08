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
- [Implementation](#implementation)
  - [NTT](#ntt)
  - [NTTDelegate](#nttdelegate)
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

## Implementation

### NTT

<!-- AUTO-GENERATED-CONTENT:START (CODE:syntax=solidity&src=./contracts/NTT.sol) -->
<!-- The below code snippet is automatically added from ./contracts/NTT.sol -->
```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "./INTT.sol";
import "./INTTMetadata.sol";

abstract contract NTT is INTT, INTTMetadata, ERC165 {
    // Token data
    struct Token {
        address issuer;
        bool valid;
    }

    // Mapping from owner to tokens
    mapping (address => Token[]) private _balances;

    // Token name
    string private _name;

    // Token symbol
    string private _symbol;

    // Contract creator
    address private _creator;

    constructor (string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
        _creator = msg.sender;
    }

    /// @notice Count all tokens assigned to an owner
    /// @param owner Address for whom to query the balance
    /// @return Number of tokens owned by `owner`
    function balanceOf(address owner) public view virtual override returns (uint256) {
        require(owner != address(0), "balance query for the zero address");
        return _balances[owner].length;
    }

    /// @notice Check if a token is hasn't been invalidated
    /// @param owner Address for whom to check the token validity
    /// @return True if the token is valid, False otherwise
    function isValid(address owner, uint256 index) public view virtual override returns (bool) {
        return _getOrRevert(owner, index).valid;
    }

    /// @notice Get the issuer of a token
    /// @param owner Address for whom to check the token issuer
    /// @param owner Index of the token
    /// @return Address of the issuer
    function issuerOf(address owner, uint256 index) public view virtual override returns (address) {
        return _getOrRevert(owner, index).issuer;
    }

    /// @return Descriptive name of the tokens in this contract
    function name() public view virtual override returns (string memory) {
        return _name;
    }

    /// @return An abbreviated name of the tokens in this contract
    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    /// @notice Fetch API link containing information for a token
    /// @param owner Address of the token's owner
    /// @param index Index of the token
    /// @return API link to query for the token's data
    function uri(address owner, uint256 index) public view virtual override returns (string memory) {
        _getOrRevert(owner, index);
        return _baseURI();
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return 
            interfaceId == type(INTT).interfaceId ||
            interfaceId == type(INTTMetadata).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /// @notice Mark the token as invalidated
    /// @param owner Address for whom to invalidate the token
    function _invalidate(address owner, uint256 index) internal virtual {
        Token storage token = _getOrRevert(owner, index);
        token.valid = false;
    }

    /// @notice Mint a new token
    /// @param owner Address for whom to assign the token
    function _mint(address owner) internal virtual {
        Token[] storage tokens = _balances[owner];
        tokens.push(Token(msg.sender, true));
    }

    function _baseURI() internal view virtual returns (string memory) {
        return "";
    }

    function _isCreator() internal view virtual returns (bool) {
        return msg.sender == _creator;
    }

    function _getOrRevert(address owner, uint256 index) internal view virtual returns (Token storage) {
        Token[] storage tokens = _balances[owner];
        require(index < tokens.length, "NTT does not exist");
        return tokens[index];
    }
}
```
<!-- AUTO-GENERATED-CONTENT:END -->

### NTTDelegate

<!-- AUTO-GENERATED-CONTENT:START (CODE:syntax=solidity&src=./contracts/NTTDelegate.sol) -->
<!-- The below code snippet is automatically added from ./contracts/NTTDelegate.sol -->
```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./INTTDelegate.sol";
import "./NTT.sol";

abstract contract NTTDelegate is NTT, INTTDelegate {
    // Mapping from operator to list of owners
    mapping (address => mapping(address => bool)) _allowed;

    /// @notice Grant one-time minting right to `operator` for `owner`
    /// An allowed operator can call the function to transfer rights.
    /// @param operator Address allowed to mint
    /// @param owner Address for whom `operator` is allowed to mint
    function delegate(address operator, address owner) public virtual override {
        bool isCreator = _isCreator();
        require(
            isCreator || _allowed[msg.sender][owner],
            "Only contract creator or allowed operator can delegate"
        );
        if (!isCreator) {
            _allowed[msg.sender][owner] = false;
        }
        _allowed[operator][owner] = true;
    }

    /// @notice Mint a token
    /// @param owner Address for whom the token is minted
    function mint(address owner) public virtual override {
        bool isCreator = _isCreator();
        require(
            isCreator || _allowed[msg.sender][owner],
            "Only contract creator or allowed operator can mint"
        );
        _mint(owner);
        if (!isCreator) {
            _allowed[msg.sender][owner] = false;
        }
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(NTT) returns (bool) {
        return 
            interfaceId == type(INTTDelegate).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
```
<!-- AUTO-GENERATED-CONTENT:END -->