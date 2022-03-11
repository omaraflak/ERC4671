import { utilsForWallet1 } from "./utils"
const { getContractFactory } = utilsForWallet1

const contractFactory = getContractFactory("bin/EIPCreatorBadge.abi", "bin/EIPCreatorBadge.bin")

contractFactory.deploy().then(contract => {
    console.log("tx hash:", contract.deployTransaction.hash)
    contract.deployed().then(deployed_contract => {
        console.log("contract:", deployed_contract.address)
    })
}).catch(console.error)