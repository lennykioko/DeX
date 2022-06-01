const { ethers } = require('ethers')

const ETHER_ADDRESS = ethers.constants.AddressZero

const ether = (num) => {
  return ethers.utils.parseEther(num.toString())
}

const tokens = (num) => ether(num)

module.exports = {
  ETHER_ADDRESS,
  ether,
  tokens,
}