// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import "./INTT.sol";
import "./INTTMetadata.sol";
import "./INTTMetadataStore.sol";

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

    // Metadata store
    address private _store;

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

    /// @return Descriptive name of the tokens in this contract
    function name() public view virtual override returns (string memory) {
        return _name;
    }

    /// @return An abbreviated name of the tokens in this contract
    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    /// @return Address of the metadata store
    function store() external view virtual override returns (address) {
        return _store;
    }

    /// @notice Chek if a token has metadata
    /// @param owner Address of the token's owner
    /// @param index Index of the token
    /// @return True if the token has an entry in the metadata store, false otherwise
    function hasMetadata(address owner, uint256 index) external view virtual override returns (bool) {
        INTTMetadataStore metadataStore = _getStoreOrRevert();
        return metadataStore.hasMetadata(_self(), owner, index);
    }

    /// @notice Get the metadata of a token from the metadata store
    /// @param owner Address of the token's owner
    /// @param index Index of the token
    /// @return Metadata of the token
    function getMetadata(address owner, uint256 index) external view virtual override returns (INTTMetadataStore.Metadata memory) {
        _getTokenOrRevert(owner, index);
        INTTMetadataStore metadataStore = _getStoreOrRevert();
        return metadataStore.getMetadata(_self(), owner, index);
    }

    /// @notice Set the metadata of a token
    /// @param owner Address of the token's owner
    /// @param index Index of the token
    /// @param metadata Metadata to set
    function setMetadata(address owner, uint256 index, INTTMetadataStore.Metadata memory metadata) external virtual override {
        INTTMetadataStore metadataStore = _getStoreOrRevert();
        metadataStore.setMetadata(_self(), owner, index, metadata);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return 
            interfaceId == type(INTT).interfaceId ||
            interfaceId == type(INTTMetadata).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function _setMetadataStore(address store_) internal virtual {
        IERC165 erc165 = IERC165(store_);
        require(
            erc165.supportsInterface(type(INTTMetadataStore).interfaceId),
            "Address provided does not comply with INTTMetadataStore"
        );
        _store = store_;
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
    }

    /// @return True if the caller is the contract's creator, false otherwise
    function _isCreator() internal view virtual returns (bool) {
        return msg.sender == _creator;
    }

    /// @notice Retrieve a Token or revert if it does not exist
    /// @param owner Address of the token's owner
    /// @param index Index of the token
    /// @return The Token struct
    function _getTokenOrRevert(address owner, uint256 index) internal view virtual returns (Token storage) {
        Token[] storage tokens = _balances[owner];
        require(index < tokens.length, "NTT does not exist");
        return tokens[index];
    }

    function _getStoreOrRevert() internal view virtual returns (INTTMetadataStore) {
        require(_store != address(0), "No metadata store provided");
        return INTTMetadataStore(_store);
    }

    function _self() internal view virtual returns (address) {
        return address(this);
    }
}