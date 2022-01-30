import { getContract } from "./utils"

const contract = getContract("0x5845d360099Fb3f41954F9Fcc5A41dfc4480Df0C", "bin/EIPCreatorBadge.abi")

contract.functions.name()
.then(console.log)
.catch(console.error)

contract.functions.symbol()
.then(console.log)
.catch(console.error)

contract.functions.total()
.then(console.log)
.catch(console.error)

// contract.functions.giveThatManABadge("0xbD9baE0E5a75361e3D8F47Ec7C38271Ae5650BC2")
// .then(console.log)
// .catch(console.error)

// contract.functions.balanceOf("0xbD9baE0E5a75361e3D8F47Ec7C38271Ae5650BC2")
// .then(console.log)
// .catch(console.error)

// contract.functions.tokenOfOwnerByIndex("0xbD9baE0E5a75361e3D8F47Ec7C38271Ae5650BC2", 1)
// .then(console.log)
// .catch(console.error)

// contract.functions.hasValid("0xbD9baE0E5a75361e3D8F47Ec7C38271Ae5650BC2")
// .then(console.log)
// .catch(console.error)