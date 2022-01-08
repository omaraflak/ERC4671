// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "./INTT.sol";
import "./INTTMetadata.sol";

abstract contract NTT is INTT, INTTMetadata, ERC165 {
    // Mapping from owner to NTTs
    mapping (address => bool[]) private _balances;

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

    /// @notice Count all NTTs assigned to an owner
    /// @param owner Address for whom to query the balance
    /// @return Number of NTTs owned by `owner`
    function balanceOf(address owner) public view virtual override returns (uint256) {
        require(owner != address(0), "balance query for the zero address");
        return _balances[owner].length;
    }

    /// @notice Check if a NTT is hasn't been invalidated
    /// @param owner Address for whom to check the NTT validity
    /// @return True if the NTT is valid, False otherwise
    function isValid(address owner, uint256 index) public view virtual override returns (bool) {
        bool[] storage tokens = _balances[owner];
        require(index < tokens.length, "NTT does not exist");
        return tokens[index];
    }

    /// @return Descriptive name of the NTTs in this contract
    function name() public view virtual override returns (string memory) {
        return _name;
    }

    /// @return An abbreviated name of the NTTs in this contract
    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    /// @notice Fetch API link containing information for an NTT
    /// @param owner Address of the NTT's owner
    /// @param index Index of the NTT
    /// @return API link to query for the NTT
    function uri(address owner, uint256 index) public view virtual override returns (string memory) {
        bool[] storage tokens = _balances[owner];
        require(index < tokens.length, "NTT does not exist");
        return _baseURI();
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return 
            interfaceId == type(INTT).interfaceId ||
            interfaceId == type(INTTMetadata).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /// @notice Mark the NTT as invalidated
    /// @param owner Address for whom to invalidate the NTT
    function _invalidate(address owner, uint256 index) internal virtual {
        bool[] storage tokens = _balances[owner];
        require(index < tokens.length, "NTT does not exist");
        tokens[index] = false;
    }

    /// @notice Mint a new token
    /// @param owner Address to whom to assign the token
    function _mint(address owner) internal virtual {
        bool[] storage tokens = _balances[owner];
        tokens.push(true);
    }

    function _baseURI() internal view virtual returns (string memory) {
        return "";
    }

    function _isCreator() internal view virtual returns (bool) {
        return msg.sender == _creator;
    }
}