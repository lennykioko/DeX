import React, { useState, useContext, createContext } from 'react'
import ExchangeAbi from '../lib/Exchange.json'
import TokenAbi from '../lib/Token.json'

import { ethers } from 'ethers'

const AppContext = createContext()

export function useAppContext() {
  return useContext(AppContext)
}

export function AppContextProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false)
  const [connectedAddress, setconnectedAddress] = useState('')
  const [,] = useState()
  const [,] = useState()
  const [,] = useState()

  const exchangeAddr = '0x885d6A2AcaF0539172e3f54e8017B079F209D08e'
  const tokenAddr = '0xE30539283b953DF77C2e5C0a0279B69D655e6849'

  const getContract = (address, abi) => {
    const httpProvider = new ethers.providers.JsonRpcProvider(
      'http://localhost:7545'
    )
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(address, abi, httpProvider)

    return contract
  }

  // const exchange = getContract(ExchangeAbi, exchangeAddr)
  // const token = getContract(TokenAbi, tokenAddr)

  // connecting the wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert('Please install Metamask!')
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      // console.log("accounts" +accounts)
      setconnectedAddress(accounts)
    } catch (e) {
      console.log(e)
      throw new Error('No ethereum account!')
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) return alert('Please install Metamask!')
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts.length) {
        setconnectedAddress(accounts[0])
      } else {
        connectWallet()
      }
    } catch (e) {
      console.log(e)
      throw new Error('No ethereum account!')
    }
  }

  //   const eventFilterv5 = (contractAddress, erc20abi, _provider) => {
  //     const iface = new ethers.utils.Interface(erc20abi.abi);
  //     const logs = await _provider.getLogs({
  //         address: contractAddress
  //     });
  //     const decodedEvents = logs.map(log => {
  //         iface.decodeEventLog("Transfer", log.data)
  //     });
  //     const toAddresses = decodedEvents.map(event => event["values"]["to"]);
  //     const fromAddresses = decodedEvents.map(event => event["values"]["from"]);
  //     const amounts = decodedEvents.map(event => event["values"]["value"]);
  //     return [fromAddresses, toAddresses, amounts]
  // }

  // exchange functions
  const loadAllOrders = async (exchange) => {
    // Fetch cancelled orders with the "Cancel" event stream
    // let httpProvider = new ethers.providers.JsonRpcProvider()
    // const contract = new ethers.Contract(TokenAbi, exchangeAddr, httpProvider)

    exchange.on('Cancel', (setter, NewCalcel, event) => {
      console.log('test', NewCalcel)
    })
    // const iface = new ethers.utils.Interface(ExchangeAbi.abi)

    // const provider = new ethers.providers.Web3Provider(window.ethereum)
    // const logs = await provider.getLogs({
    //   address: exchangeAddr,
    //   fromBlock: 'latest',
    //   toBlock: 'latest',
    // })

    // const decodedEvents = logs.map((log) => {
    //   iface.decodeEventLog('Trade', log.data)
    // })

    // console.log(decodedEvents)

    // provider.getCode(exchangeAddr).then((code) => {
    //   console.log("Code:", code);
    // });
  }

  const cancelOrder = async () => {}

  const fillOrder = async () => {}

  const subscribeToEvents = async () => {}

  const loadBalances = async () => {}

  const depositEther = async () => {}

  const withdrawEther = async () => {}

  const depositToken = async () => {}

  const withdrawToken = async () => {}

  const makeBuyOrder = async () => {}

  const makeSellOrder = async () => {}

  const context = {
    isLoading,
    setIsLoading,
    checkIfWalletIsConnected,
    connectedAddress,
    loadAllOrders,
    exchangeAddr,
    tokenAddr,
    ExchangeAbi,
    TokenAbi,
    getContract,
  }

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}
