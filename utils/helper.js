const { ethers } = require('ethers')

const ETHER_ADDRESS = ethers.constants.AddressZero

const ether = (num) => {
  return ethers.utils.parseEther(num.toString())
}

const tokens = (num) => ether(num)

export const formatBalance = (balance) => {
  const precision = 100 // 2 dp

  balance = ether(balance)
  balance = Math.round(balance * precision) / precision // Use 2 dp

  return balance
}

module.exports = {
  ETHER_ADDRESS,
  ether,
  tokens,
  formatBalance,
}
