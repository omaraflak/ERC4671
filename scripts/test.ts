import { utilsForWallet1, utilsForWallet2 } from "./utils"
import { strict as assert } from "assert"
import { ethers, BigNumber } from "ethers"

const abi = "bin/EIPCreatorBadge.abi"
const bin = "bin/EIPCreatorBadge.bin"
const contractFactory = utilsForWallet1.getContractFactory(abi, bin)

function assertBigNumberEqual(actual: any, expected: BigNumber, message: string = null) {
    if (message != null) {
        console.log("check " + message + "...")
    }
    assert.ok(actual[0] instanceof BigNumber)
    assert.equal(actual[0]._hex, expected._hex)
}

function assertStringEqual(actual: any, expected: string, message: string = null) {
    if (message != null) {
        console.log("check " + message + "...")
    }
    assert.equal(typeof actual[0], "string")
    assert.equal(actual[0], expected)
}

function assertBoolEqual(actual: any, expected: boolean, message: string = null) {
    if (message != null) {
        console.log("check " + message + "...")
    }
    assert.equal(typeof actual[0], "boolean")
    assert.equal(actual[0], expected)
}

const main = async () => {
    const deployTx = await contractFactory.deploy()
    console.log("deploy tx hash:", deployTx.deployTransaction.hash)

    const deployedContract = await deployTx.deployed()
    console.log("contract address:", deployedContract.address)

    const contract1 = utilsForWallet1.getContract(deployedContract.address, abi)
    
    // check name, symbol, emittedCount
    assertStringEqual(await contract1.functions.name(), "EIP Creator Badge", "name")
    assertStringEqual(await contract1.functions.symbol(), "EIP", "symbol")
    assertBigNumberEqual(await contract1.functions.emittedCount(), BigNumber.from(0), "emitted count")

    // transfer badge to wallet 2
    console.log("transfer 3 tokens to " + utilsForWallet2.wallet.address)
    await (await contract1.functions.giveThatManABadge(utilsForWallet2.wallet.address)).wait()
    await (await contract1.functions.giveThatManABadge(utilsForWallet2.wallet.address)).wait()
    await (await contract1.functions.giveThatManABadge(utilsForWallet2.wallet.address)).wait()

    // check new balances and count after transfer
    assertBigNumberEqual(await contract1.functions.balanceOf(utilsForWallet1.wallet.address), BigNumber.from(0), "balance of " + utilsForWallet1.wallet.address)
    assertBigNumberEqual(await contract1.functions.balanceOf(utilsForWallet2.wallet.address), BigNumber.from(3), "balance of " + utilsForWallet2.wallet.address)
    assertBigNumberEqual(await contract1.functions.emittedCount(), BigNumber.from(3), "emitted count")
    assertBigNumberEqual(await contract1.functions.holdersCount(), BigNumber.from(1), "holders count")

    // check holders
    const holders = await contract1.functions.holders()
    assert.ok(holders instanceof Array)
    assert.equal(holders.length, 1)
    assertStringEqual(holders[0], utilsForWallet2.wallet.address, "only holder is " + utilsForWallet2.wallet.address)

    // check token ids
    assertBigNumberEqual(await contract1.functions.tokenOfOwnerByIndex(utilsForWallet2.wallet.address, 0), BigNumber.from(0), "index of tokenId 0");
    assertBigNumberEqual(await contract1.functions.tokenOfOwnerByIndex(utilsForWallet2.wallet.address, 1), BigNumber.from(1), "index of tokenId 1");
    assertBigNumberEqual(await contract1.functions.tokenOfOwnerByIndex(utilsForWallet2.wallet.address, 2), BigNumber.from(2), "index of tokenId 2");
    
    // check tokens valididity
    assertBoolEqual(await contract1.functions.hasValid(utilsForWallet2.wallet.address), true, utilsForWallet2.wallet.address + " has valid tokens")
    assertBoolEqual(await contract1.functions.isValid(0), true, "token 0 valid")
    assertBoolEqual(await contract1.functions.isValid(1), true, "token 1 valid")
    assertBoolEqual(await contract1.functions.isValid(2), true, "token 2 valid")

    // revoke token
    console.log("revoke token 1")
    await (await contract1.functions.revoke(1)).wait()

    // check unchanged balance
    assertBigNumberEqual(await contract1.functions.balanceOf(utilsForWallet2.wallet.address), BigNumber.from(3), "balance of " + utilsForWallet2.wallet.address)
    
    // check token has been invalidated
    assertBoolEqual(await contract1.functions.hasValid(utilsForWallet2.wallet.address), true, utilsForWallet2.wallet.address + " has valid tokens")
    assertBoolEqual(await contract1.functions.isValid(1), false, "token 1 is invalid")

    // tokenId, owner, recipient
    const messageHash = ethers.utils.solidityKeccak256(
        ["uint256", "address", "address"],
        [1, utilsForWallet2.wallet.address, utilsForWallet1.wallet.address]
    )
    const messageHashBinary = ethers.utils.arrayify(messageHash)
    const messageHashSigned = await utilsForWallet2.wallet.signMessage(messageHashBinary)

    // transfer token with signature
    console.log("pull token 1 from " + utilsForWallet2.wallet.address + " to " + utilsForWallet1.wallet.address)
    await (await contract1.functions.pull(1, utilsForWallet2.wallet.address, messageHashSigned)).wait()
    
    // check balances and counts
    assertBigNumberEqual(await contract1.functions.balanceOf(utilsForWallet1.wallet.address), BigNumber.from(1), "balance of " + utilsForWallet1.wallet.address)
    assertBigNumberEqual(await contract1.functions.balanceOf(utilsForWallet2.wallet.address), BigNumber.from(2), "balance of " + utilsForWallet2.wallet.address)
    assertBigNumberEqual(await contract1.functions.emittedCount(), BigNumber.from(3), "emitted count")
    assertBigNumberEqual(await contract1.functions.holdersCount(), BigNumber.from(2), "holders count")

    // check token is still invalid
    assertBoolEqual(await contract1.functions.isValid(1), false, "token 1 is invalid")
    assertBoolEqual(await contract1.functions.hasValid(utilsForWallet1.wallet.address), false, utilsForWallet1.wallet.address + " has no valid tokens")
    assertBoolEqual(await contract1.functions.hasValid(utilsForWallet2.wallet.address), true, utilsForWallet2.wallet.address + " has valid tokens")

    // check new holders
    console.log("checking new holders")
    const newHolders = (await contract1.functions.holders())[0]
    assert.ok(newHolders instanceof Array)
    assert.equal(newHolders.length, 2)
    assert.equal(newHolders[0], utilsForWallet2.wallet.address)
    assert.equal(newHolders[1], utilsForWallet1.wallet.address)

    // check token indices
    assertBigNumberEqual(await contract1.functions.tokenOfOwnerByIndex(utilsForWallet1.wallet.address, 0), BigNumber.from(1), "index of tokenId 1");
    assertBigNumberEqual(await contract1.functions.tokenOfOwnerByIndex(utilsForWallet2.wallet.address, 0), BigNumber.from(0), "index of tokenId 0");
    assertBigNumberEqual(await contract1.functions.tokenOfOwnerByIndex(utilsForWallet2.wallet.address, 1), BigNumber.from(2), "index of tokenId 1");

    // transfer back token 1
    const messageHash2 = ethers.utils.solidityKeccak256(
        ["uint256", "address", "address"],
        [1, utilsForWallet1.wallet.address, utilsForWallet2.wallet.address]
    )
    const messageHashBinary2 = ethers.utils.arrayify(messageHash2)
    const messageHashSigned2 = await utilsForWallet1.wallet.signMessage(messageHashBinary2)

    // transfer token with signature
    console.log("pull token 1 from " + utilsForWallet1.wallet.address + " to " + utilsForWallet2.wallet.address)
    const contract2 = utilsForWallet2.getContract(deployedContract.address, abi)
    await (await contract2.functions.pull(1, utilsForWallet1.wallet.address, messageHashSigned2)).wait()
    
    // check balances and counts
    assertBigNumberEqual(await contract1.functions.balanceOf(utilsForWallet1.wallet.address), BigNumber.from(0), "balance of " + utilsForWallet1.wallet.address)
    assertBigNumberEqual(await contract1.functions.balanceOf(utilsForWallet2.wallet.address), BigNumber.from(3), "balance of " + utilsForWallet2.wallet.address)
    assertBigNumberEqual(await contract1.functions.emittedCount(), BigNumber.from(3), "emitted count")
    assertBigNumberEqual(await contract1.functions.holdersCount(), BigNumber.from(1), "holders count")

    // check token validity
    assertBoolEqual(await contract1.functions.isValid(1), false, "token 1 is invalid")

    // check token indices
    assertBigNumberEqual(await contract1.functions.tokenOfOwnerByIndex(utilsForWallet2.wallet.address, 0), BigNumber.from(0), "index of tokenId 0");
    assertBigNumberEqual(await contract1.functions.tokenOfOwnerByIndex(utilsForWallet2.wallet.address, 1), BigNumber.from(2), "index of tokenId 2");
    assertBigNumberEqual(await contract1.functions.tokenOfOwnerByIndex(utilsForWallet2.wallet.address, 2), BigNumber.from(1), "index of tokenId 1");

    // revoke all tokens
    console.log("revoke tokens 0,2")
    await (await contract1.functions.revoke(0)).wait()
    await (await contract1.functions.revoke(2)).wait()

    // check has valid
    assertBoolEqual(await contract1.functions.hasValid(utilsForWallet2.wallet.address), false, utilsForWallet2.wallet.address + " has no valid tokens")
}

try {
    main()
} catch (e) {
    console.log(e)
}