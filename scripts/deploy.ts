import { account1, disconnect } from "./accounts"

const contractFactory = account1.getContractFactory("bin/EIPCreatorBadge.abi", "bin/EIPCreatorBadge.bin")

contractFactory.deploy().then(contract => {
    console.log("tx hash:", contract.deployTransaction.hash)
    return contract.deployed()
})
.then(deployed_contract => {
    console.log("contract:", deployed_contract.address)
})
.then(disconnect)
.catch(console.error)