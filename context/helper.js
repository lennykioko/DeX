const { ethers } = require('ethers')

export const RED = 'red'
export const GREEN = 'green'

export const ETHER_ADDRESS = ethers.constants.AddressZero

export const ether = (num) => {
  return ethers.utils.formatEther(num)
}

export const tokens = (num) => ether(num)

export const inputEther = (num) => {
  return ethers.utils.parseEther(num.toString())
}

export const inputTokens = (num) => inputEther(num)
