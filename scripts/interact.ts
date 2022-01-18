import { getContract } from "./utils"

const contract = getContract("0x8cBeB62310abE44Adc1e76Da6276bC3fC707C1Cd", "bin/EIPCreatorBadge.abi")

// contract.functions.giveThatManABadge("0x74d4fe664108A8fF48268D1C1904463D6540F02C")
// .then(console.log)
// .catch(console.error)

// contract.functions.delegate("0xbD9baE0E5a75361e3D8F47Ec7C38271Ae5650BC2", "0x77aabF4893DDEA4f0AD14e26D9151c2940463bbF")
// .then(console.log)
// .catch(console.error)

// contract.functions.mint("0x77aabF4893DDEA4f0AD14e26D9151c2940463bbF")
// .then(console.log)
// .catch(console.error)

contract.functions.isDelegate("0x77aabF4893DDEA4f0AD14e26D9151c2940463bbF")
.then(console.log)
.catch(console.error)
