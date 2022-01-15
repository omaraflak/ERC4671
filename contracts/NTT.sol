// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
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

    // Total number of tokens emitted
    uint256 private _total;

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
    /// @return True if the token is valid, false otherwise
    function isValid(address owner, uint256 index) public view virtual override returns (bool) {
        return _getTokenOrRevert(owner, index).valid;
    }

    /// @notice Get the issuer of a token
    /// @param owner Address for whom to check the token issuer
    /// @param owner Index of the token
    /// @return Address of the issuer
    function issuerOf(address owner, uint256 index) public view virtual override returns (address) {
        return _getTokenOrRevert(owner, index).issuer;
    }

    /// @notice Get all the tokens of an account
    /// @param owner Address for whom to get the tokens
    /// @return Array of tokens
    function tokensOf(address owner) public view virtual returns (Token[] memory) {
        return _balances[owner];
    }

    /// @return Descriptive name of the tokens in this contract
    function name() public view virtual override returns (string memory) {
        return _name;
    }

    /// @return An abbreviated name of the tokens in this contract
    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    /// @notice URI to query to get the token's metadata
    /// @param owner Address of the token's owner
    /// @param index Index of the token
    /// @return URI for the token
    function tokenURI(address owner, uint256 index) public view virtual override returns (string memory) {
        _getTokenOrRevert(owner, index);
        bytes memory baseURI = bytes(_baseURI());
        if (baseURI.length > 0) {
            return string(abi.encodePacked(baseURI, tokenId(owner, index)));
        }
        return "";
    }

    /// @return Total number of tokens emitted by the contract
    function total() public view virtual override returns (uint256) {
        return _total;
    }

    /// @param owner Address of the token's owner
    /// @param index Index of the token
    /// @return A unique identifier for that token
    function tokenId(address owner, uint256 index) public pure virtual returns (string memory) {
        return string(abi.encodePacked(
            Strings.toHexString(uint256(uint160(owner)), 20),
            Strings.toHexString(index, 32)
        ));
    }

    /// @notice Check if a given address owns a valid token
    /// @param owner Address for whom to check
    /// @return True if `owner` has a valid token, false otherwise
    function hasValidToken(address owner) external view virtual returns (bool) {
        Token[] storage tokens = _balances[owner];
        for (uint i=0; i<tokens.length; i++) {
            if (tokens[i].valid) {
                return true;
            }
        }
        return false;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return 
            interfaceId == type(INTT).interfaceId ||
            interfaceId == type(INTTMetadata).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /// @notice Prefix for all calls to tokenURI
    /// @return Common base URI for all token
    function _baseURI() internal pure virtual returns (string memory) {
        return "";
    }

    /// @notice Mark the token as invalidated
    /// @param owner Address for whom to invalidate the token
    function _invalidate(address owner, uint256 index) internal virtual {
        Token storage token = _getTokenOrRevert(owner, index);
        token.valid = false;
    }

    /// @notice Mint a new token
    /// @param owner Address for whom to assign the token
    function _mint(address owner) internal virtual {
        Token[] storage tokens = _balances[owner];
        tokens.push(Token(msg.sender, true));
        _total += 1;
    }

    /// @return True if the caller is the contract's creator, false otherwise
    function _isCreator() internal view virtual returns (bool) {
        return msg.sender == _creator;
    }

    /// @notice Retrieve a Token or revert if it does not exist
    /// @param owner Address of the token's owner
    /// @param index Index of the token
    /// @return The Token struct
    function _getTokenOrRevert(address owner, uint256 index) private view returns (Token storage) {
        Token[] storage tokens = _balances[owner];
        require(index < tokens.length, "NTT does not exist");
        return tokens[index];
    }
}