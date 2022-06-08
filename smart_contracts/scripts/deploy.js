// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat')
const ethers = hre.ethers

async function main() {
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const accounts = await ethers.getSigners() // provides the fee account when testing locally

  // We get the contract to deploy
  const Token = await hre.ethers.getContractFactory('Token')
  const token = await Token.deploy()
  await token.deployed()

  console.log('Token deployed: ', token.address)

  // We get the contract to deploy
  const Exchange = await hre.ethers.getContractFactory('Exchange')
  const exchange = await Exchange.deploy(
    accounts[2].address,
    // '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', // add a fee address here
    10
  )
  await exchange.deployed()

  console.log('Exchange deployed: ', exchange.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
