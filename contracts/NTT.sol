// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import "./INTT.sol";
import "./INTTMetadata.sol";
import "./INTTEnumerable.sol";

abstract contract NTT is INTT, INTTMetadata, INTTEnumerable, ERC165 {
    // Token data
    struct Token {
        address issuer;
        bool valid;
    }

    // Mapping from owner to tokens
    mapping(address => mapping(uint256 => Token)) private _tokens;

    // Mapping from tokenId to owner
    mapping(uint256 => address) private _owners;

    // Mapping from owner to token ids
    mapping(address => uint256[]) private _indexedTokenIds;

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
    function balanceOf(address owner) public view returns (uint256) {
        return _indexedTokenIds[owner].length;
    }

    /// @notice Get owner of a token
    /// @param tokenId Identifier of the token
    /// @return Address of the owner of `tokenId`
    function ownerOf(uint256 tokenId) public view returns (address) {
        return _owners[tokenId];
    }

    /// @notice Check if a token hasn't been invalidated
    /// @param tokenId Identifier of the token
    /// @return True if the token is valid, false otherwise
    function isValid(uint256 tokenId) public view returns (bool) {
        Token storage token = _getTokenOrRevert(tokenId);
        return token.valid;
    }

    /// @notice Check if an address owns a valid token in the contract
    /// @param owner Address for whom to check the ownership
    /// @return True if `owner` has a valid token, false otherwise
    function hasValid(address owner) public view returns (bool) {
        uint256[] storage tokenIds = _indexedTokenIds[owner];
        for (uint256 i=0; i<tokenIds.length; i++) {
            Token storage token = _tokens[owner][tokenIds[i]];
            assert(token.issuer == owner);
            if (token.valid) {
                return true;
            }
        }
        return false;
    }

    /// @return Descriptive name of the tokens in this contract
    function name() public view returns (string memory) {
        return _name;
    }

    /// @return An abbreviated name of the tokens in this contract
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    /// @notice URI to query to get the token's metadata
    /// @param tokenId Identifier of the token
    /// @return URI for the token
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        _getTokenOrRevert(tokenId);
        bytes memory baseURI = bytes(_baseURI());
        if (baseURI.length > 0) {
            return string(abi.encodePacked(
                baseURI,
                Strings.toHexString(tokenId, 32)
            ));
        }
        return "";
    }

    /// @return Total number of tokens emitted by the contract
    function total() public view returns (uint256) {
        return _total;
    }

    /// @notice Get the tokenId of a token using its position in the owner's list
    /// @param owner Address for whom to get the token
    /// @param index Index of the token
    /// @return tokenId of the token
    function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256) {
        uint256[] storage ids = _indexedTokenIds[owner];
        require(index < ids.length, "Token does not exist");
        return ids[index];
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return 
            interfaceId == type(INTT).interfaceId ||
            interfaceId == type(INTTMetadata).interfaceId ||
            interfaceId == type(INTTEnumerable).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /// @notice Prefix for all calls to tokenURI
    /// @return Common base URI for all token
    function _baseURI() internal pure virtual returns (string memory) {
        return "";
    }

    /// @notice Mark the token as invalidated
    /// @param tokenId Identifier of the token
    function _invalidate(uint256 tokenId) internal virtual {
        Token storage token = _getTokenOrRevert(tokenId);
        token.valid = false;
        emit Invalidated(_owners[tokenId], tokenId);
    }

    /// @notice Mint a new token
    /// @param owner Address for whom to assign the token
    /// @return tokenId Identifier of the minted token
    function _mint(address owner) internal virtual returns (uint256 tokenId) {
        tokenId = _total;
        _tokens[owner][tokenId] = Token(msg.sender, true);
        _owners[tokenId] = owner;
        _indexedTokenIds[owner].push(tokenId);
        _total += 1;
        emit Minted(owner, tokenId);
    }

    /// @return True if the caller is the contract's creator, false otherwise
    function _isCreator() internal view virtual returns (bool) {
        return msg.sender == _creator;
    }

    /// @notice Retrieve a Token or revert if it does not exist
    /// @param tokenId Identifier of the token
    /// @return The Token struct
    function _getTokenOrRevert(uint256 tokenId) internal view returns (Token storage) {
        address owner = _owners[tokenId];
        require(owner != address(0), "Token does not exist");
        Token storage token = _tokens[owner][tokenId];
        assert(token.issuer != address(0));
        return token;
    }
}