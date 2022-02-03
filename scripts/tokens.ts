import { getContract, wallet } from "./utils"

const addresses = [
    "0x2260fA705e6a1Ad309a3bF38eb451FF3654A1B76"
]

addresses.forEach((address: string) => {
    const contract = getContract(address, "bin/ERC4671.abi")
    const promises = [
        contract.functions.name(),
        contract.functions.symbol(),
        contract.functions.balanceOf(wallet.address)
    ]
    Promise.all(promises).then(data => {
        const [name, symbol, balance] = data
        console.log(`${name}, ${symbol}, balance: ${parseInt(balance[0]._hex, 16)}`)
    })
})
