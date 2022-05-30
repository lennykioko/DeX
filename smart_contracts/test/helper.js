// import { ethers } from 'ethers'

const { ethers } = require('ethers')

const EVM_REVERT = 'VM Exception while processing transaction: revert'

const ETHER_ADDRESS = ethers.constants.AddressZero
// const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'

const ether = (num) => {
  // return new web3.utils.BN(web3.utils.toWei(num.toString(), 'ether'))
  return ethers.utils.parseEther(num.toString())
}

const tokens = (num) => ether(num)

module.exports = {
  EVM_REVERT,
  ETHER_ADDRESS,
  tokens,
  ether,
}
