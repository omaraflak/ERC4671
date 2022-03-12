import { strict as assert } from "assert"
import { BigNumber } from "ethers"
import { account1, account2, disconnect } from "./accounts"
import { ERC4671 } from "./ERC4671"

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

async function testEIPCreatorBadge() {
    const abi = "bin/EIPCreatorBadge.abi"
    const bin = "bin/EIPCreatorBadge.bin"

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
}

async function testERC4671Store() {
    const abi = "bin/ERC4671Store.abi"
    const bin = "bin/ERC4671Store.bin"

    const contractFactory = account1.getContractFactory(abi, bin)
    const deployTx = await contractFactory.deploy()
    console.log("deploy tx hash:", deployTx.deployTransaction.hash)

    const deployedContract = await deployTx.deployed()
    console.log("contract address:", deployedContract.address)

    console.log("adding contracts to address " + account1.wallet.address)
    const contract1 = account1.getContract(deployedContract.address, abi)
    await (await contract1.functions.add("0x907627314396174746b939C6Dd365e43e0F00FE0")).wait()
    await (await contract1.functions.add("0xABF606Ad4BA27cfa07202FD90f0a472e85564D05")).wait()

    console.log("adding contracts to address " + account2.wallet.address)
    const contract2 = account2.getContract(deployedContract.address, abi)
    await (await contract2.functions.add("0xABF606Ad4BA27cfa07202FD90f0a472e85564D05")).wait()

    console.log("getting contracts for address " + account1.wallet.address)
    const addresses1 = await contract1.functions.get(account1.wallet.address).then(d => d[0])
    assert.ok(addresses1 instanceof Array)
    assert.equal(addresses1.length, 2)
    assert.equal(addresses1[0], "0x907627314396174746b939C6Dd365e43e0F00FE0")
    assert.equal(addresses1[1], "0xABF606Ad4BA27cfa07202FD90f0a472e85564D05")

    console.log("getting contracts for address " + account2.wallet.address)
    const addresses2 = await contract1.functions.get(account2.wallet.address).then(d => d[0])
    assert.ok(addresses2 instanceof Array)
    assert.equal(addresses2.length, 1)
    assert.equal(addresses2[0], "0xABF606Ad4BA27cfa07202FD90f0a472e85564D05")

    console.log("removing contracts")
    await (await contract1.functions.remove("0x907627314396174746b939C6Dd365e43e0F00FE0")).wait()
    await (await contract2.functions.remove("0xABF606Ad4BA27cfa07202FD90f0a472e85564D05")).wait()

    console.log("checking new contracts for address " + account1.wallet.address)
    const newAddresses1 = await contract1.functions.get(account1.wallet.address).then(d => d[0])
    assert.ok(newAddresses1 instanceof Array)
    assert.equal(newAddresses1.length, 1)
    assert.equal(newAddresses1[0], "0xABF606Ad4BA27cfa07202FD90f0a472e85564D05")

    console.log("checking new contracts for address " + account2.wallet.address)
    const newAddresses2 = await contract1.functions.get(account2.wallet.address).then(d => d[0])
    assert.ok(newAddresses2 instanceof Array)
    assert.equal(newAddresses2.length, 0)
}

async function testERC4671Consensus() {
    const abi = "bin/ERC4671Consensus.abi"
    const bin = "bin/ERC4671Consensus.bin"

    const contractFactory = account1.getContractFactory(abi, bin)
    const deployTx = await contractFactory.deploy(
        "Consensus",
        "NTTC",
        [
            account1.wallet.address,
            account2.wallet.address
        ]
    )
    console.log("deploy tx hash:", deployTx.deployTransaction.hash)

    const deployedContract = await deployTx.deployed()
    console.log("contract address:", deployedContract.address)

    const contract1 = new ERC4671(account1.getContract(deployedContract.address, abi))
    const contract2 = new ERC4671(account2.getContract(deployedContract.address, abi))

    assertStringEqual(await contract1.name(), "Consensus", "name")
    assertStringEqual(await contract1.symbol(), "NTTC", "symbol")

    console.log("checking voters")
    const voters = await contract1.voters()
    assert.equal(voters.length, 2)
    assertStringEqual(voters[0], account1.wallet.address, "first voter")
    assertStringEqual(voters[1], account2.wallet.address, "second voter")

    console.log("first approve mint for address " + account1.wallet.address)
    await contract1.approveMint(account1.wallet.address)

    assertBigNumberEqual(await contract1.balanceOf(account1.wallet.address), BigNumber.from(0), "no token for address " + account1.wallet.address)

    console.log("second approve mint for address " + account1.wallet.address)
    await contract2.approveMint(account1.wallet.address)

    assertBigNumberEqual(await contract1.balanceOf(account1.wallet.address), BigNumber.from(1), "token minted for address " + account1.wallet.address)
    assertBigNumberEqual(await contract1.tokenOfOwnerByIndex(account1.wallet.address, 0), BigNumber.from(0), "tokenId")

    console.log("first revoke of token for address " + account1.wallet.address)
    await contract1.approveRevoke(0)

    assertBoolEqual(await contract1.isValid(0), true, "token valid for address " + account1.wallet.address)

    console.log("second revoke of token for address " + account1.wallet.address)
    await contract2.approveRevoke(0)

    assertBoolEqual(await contract1.isValid(0), false, "token invalid for address " + account1.wallet.address)
}

try {
    Promise.resolve()
    .then(testEIPCreatorBadge)
    .then(testERC4671Consensus)
    .then(testERC4671Store)
    .then(disconnect)
} catch (e) {
    console.log(e)
}