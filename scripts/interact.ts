import { BigNumber, ethers } from "ethers"
import { utilsForWallet1 } from "./utils"
const { getContract } = utilsForWallet1

const contract = getContract("0xD844eF26c5ae09B1bD3367EC76f0B50aB08BaF71", "bin/EIPCreatorBadge.abi")

const tokenId = 1
const owner = "0x77aabF4893DDEA4f0AD14e26D9151c2940463bbF"
const recipient = "0xbD9baE0E5a75361e3D8F47Ec7C38271Ae5650BC2"

// const messageHash = ethers.utils.solidityKeccak256(["uint256", "address", "address"], [tokenId, owner, recipient])
// const messageHashBinary = ethers.utils.arrayify(messageHash)
// wallet.signMessage(messageHashBinary).then(console.log)

// contract.functions.pull(tokenId, owner, "")
// .then(console.log)
// .catch(console.log)

// contract.functions.name()
// .then(console.log)
// .catch(console.error)

// contract.functions.symbol()
// .then(console.log)
// .catch(console.error)

// contract.functions.emittedCount()
// .then(console.error)
// .catch(console.error)

// contract.functions.holders()
// .then(console.log)
// .catch(console.error)

// contract.functions.giveThatManABadge("0x77aabF4893DDEA4f0AD14e26D9151c2940463bbF")
// .then(console.log)
// .catch(console.error)

// contract.functions.balanceOf("0xbD9baE0E5a75361e3D8F47Ec7C38271Ae5650BC2")
// .then(console.log)
// .catch(console.error)

// contract.functions.holders()
// .then(console.log)
// .catch(console.error)

const main = async () => {
    const holders = (await contract.functions.holders())[0]
    console.log(holders)
}

main()

// contract.functions.tokenOfOwnerByIndex("0xbD9baE0E5a75361e3D8F47Ec7C38271Ae5650BC2", 0)
// .then(console.log)
// .catch(console.error)

// contract.functions.hasValid("0xbD9baE0E5a75361e3D8F47Ec7C38271Ae5650BC2")
// .then(console.log)
// .catch(console.error)

// contract.functions.isValid(1)
// .then(console.log)
// .catch(console.error)

// contract.functions.invalidate(1)
// .then(console.log)
// .catch(console.error)