import { utilsForWallet1 } from "./utils"
const { wallet, getContract } = utilsForWallet1

const addresses = [
    "0xdd7aa796a65e76a2e2e0462fc700c61d3d739e9c"
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
