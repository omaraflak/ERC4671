import { strict as assert } from "assert"
import { ethers, BigNumber } from "ethers"
import { account1, account2, disconnect } from "./accounts"
import { ERC4671 } from "./ERC4671"

const abi = "bin/EIPCreatorBadge.abi"
const bin = "bin/EIPCreatorBadge.bin"

function assertBigNumberEqual(actual: any, expected: BigNumber, message: string = null) {
    if (message != null) {
        console.log("check " + message + "...")
    }
    assert.ok(actual instanceof BigNumber)
    assert.equal(actual._hex, expected._hex)
}

function assertStringEqual(actual: any, expected: string, message: string = null) {
    if (message != null) {
        console.log("check " + message + "...")
    }
    assert.equal(typeof actual, "string")
    assert.equal(actual, expected)
}

function assertBoolEqual(actual: any, expected: boolean, message: string = null) {
    if (message != null) {
        console.log("check " + message + "...")
    }
    assert.equal(typeof actual, "boolean")
    assert.equal(actual, expected)
}

const main = async () => {
    const contractFactory = account1.getContractFactory(abi, bin)
    const deployTx = await contractFactory.deploy()
    console.log("deploy tx hash:", deployTx.deployTransaction.hash)

    const deployedContract = await deployTx.deployed()
    console.log("contract address:", deployedContract.address)

    const contract1 = new ERC4671(account1.getContract(deployedContract.address, abi))

    // check name, symbol, emittedCount
    assertStringEqual(await contract1.name(), "EIP Creator Badge", "name")
    assertStringEqual(await contract1.symbol(), "EIP", "symbol")
    assertBigNumberEqual(await contract1.emittedCount(), BigNumber.from(0), "emitted count")

    // transfer badge to wallet 2
    console.log("transfer 3 tokens to " + account2.wallet.address)
    await (await contract1.contract.functions.giveThatManABadge(account2.wallet.address)).wait()
    await (await contract1.contract.functions.giveThatManABadge(account2.wallet.address)).wait()
    await (await contract1.contract.functions.giveThatManABadge(account2.wallet.address)).wait()

    // check new balances and count after transfer
    assertBigNumberEqual(await contract1.balanceOf(account1.wallet.address), BigNumber.from(0), "balance of " + account1.wallet.address)
    assertBigNumberEqual(await contract1.balanceOf(account2.wallet.address), BigNumber.from(3), "balance of " + account2.wallet.address)
    assertBigNumberEqual(await contract1.emittedCount(), BigNumber.from(3), "emitted count")
    assertBigNumberEqual(await contract1.holdersCount(), BigNumber.from(1), "holders count")

    // check token ids
    assertBigNumberEqual(await contract1.tokenOfOwnerByIndex(account2.wallet.address, 0), BigNumber.from(0), "index of tokenId 0");
    assertBigNumberEqual(await contract1.tokenOfOwnerByIndex(account2.wallet.address, 1), BigNumber.from(1), "index of tokenId 1");
    assertBigNumberEqual(await contract1.tokenOfOwnerByIndex(account2.wallet.address, 2), BigNumber.from(2), "index of tokenId 2");

    // check tokens valididity
    assertBoolEqual(await contract1.hasValid(account2.wallet.address), true, account2.wallet.address + " has valid tokens")
    assertBoolEqual(await contract1.isValid(0), true, "token 0 valid")
    assertBoolEqual(await contract1.isValid(1), true, "token 1 valid")
    assertBoolEqual(await contract1.isValid(2), true, "token 2 valid")

    // revoke token
    console.log("revoke token 1")
    await (await contract1.contract.functions.revoke(1)).wait()

    // check unchanged balance
    assertBigNumberEqual(await contract1.balanceOf(account2.wallet.address), BigNumber.from(3), "balance of " + account2.wallet.address)

    // check token has been invalidated
    assertBoolEqual(await contract1.hasValid(account2.wallet.address), true, account2.wallet.address + " has valid tokens")
    assertBoolEqual(await contract1.isValid(1), false, "token 1 is invalid")

    // tokenId, owner, recipient
    const messageToSign = contract1.makePullMessage(1, account2.wallet.address, account1.wallet.address)
    const messageSigned = await account2.wallet.signMessage(messageToSign)

    // transfer token with signature
    console.log("pull token 1 from " + account2.wallet.address + " to " + account1.wallet.address)
    await contract1.pull(1, account2.wallet.address, messageSigned)

    // check balances and counts
    assertBigNumberEqual(await contract1.balanceOf(account1.wallet.address), BigNumber.from(1), "balance of " + account1.wallet.address)
    assertBigNumberEqual(await contract1.balanceOf(account2.wallet.address), BigNumber.from(2), "balance of " + account2.wallet.address)
    assertBigNumberEqual(await contract1.emittedCount(), BigNumber.from(3), "emitted count")
    assertBigNumberEqual(await contract1.holdersCount(), BigNumber.from(2), "holders count")

    // check token is still invalid
    assertBoolEqual(await contract1.isValid(1), false, "token 1 is invalid")
    assertBoolEqual(await contract1.hasValid(account1.wallet.address), false, account1.wallet.address + " has no valid tokens")
    assertBoolEqual(await contract1.hasValid(account2.wallet.address), true, account2.wallet.address + " has valid tokens")

    // check token indices
    assertBigNumberEqual(await contract1.tokenOfOwnerByIndex(account1.wallet.address, 0), BigNumber.from(1), "index of tokenId 1");
    assertBigNumberEqual(await contract1.tokenOfOwnerByIndex(account2.wallet.address, 0), BigNumber.from(0), "index of tokenId 0");
    assertBigNumberEqual(await contract1.tokenOfOwnerByIndex(account2.wallet.address, 1), BigNumber.from(2), "index of tokenId 1");

    // transfer back token 1
    const messageToSign2 = contract1.makePullMessage(1, account1.wallet.address, account2.wallet.address)
    const messageSigned2 = await account1.wallet.signMessage(messageToSign2)

    // transfer token with signature
    console.log("pull token 1 from " + account1.wallet.address + " to " + account2.wallet.address)
    const contract2 = new ERC4671(account2.getContract(deployedContract.address, abi))
    await contract2.pull(1, account1.wallet.address, messageSigned2)

    // check balances and counts
    assertBigNumberEqual(await contract1.balanceOf(account1.wallet.address), BigNumber.from(0), "balance of " + account1.wallet.address)
    assertBigNumberEqual(await contract1.balanceOf(account2.wallet.address), BigNumber.from(3), "balance of " + account2.wallet.address)
    assertBigNumberEqual(await contract1.emittedCount(), BigNumber.from(3), "emitted count")
    assertBigNumberEqual(await contract1.holdersCount(), BigNumber.from(1), "holders count")

    // check token validity
    assertBoolEqual(await contract1.isValid(1), false, "token 1 is invalid")

    // check token indices
    assertBigNumberEqual(await contract1.tokenOfOwnerByIndex(account2.wallet.address, 0), BigNumber.from(0), "index of tokenId 0");
    assertBigNumberEqual(await contract1.tokenOfOwnerByIndex(account2.wallet.address, 1), BigNumber.from(2), "index of tokenId 2");
    assertBigNumberEqual(await contract1.tokenOfOwnerByIndex(account2.wallet.address, 2), BigNumber.from(1), "index of tokenId 1");

    // revoke all tokens
    console.log("revoke tokens 0,2")
    await (await contract1.contract.functions.revoke(0)).wait()
    await (await contract1.contract.functions.revoke(2)).wait()

    // check has valid
    assertBoolEqual(await contract1.hasValid(account2.wallet.address), false, account2.wallet.address + " has no valid tokens")

    // close connections
    disconnect()
}

try {
    main()
} catch (e) {
    console.log(e)
}