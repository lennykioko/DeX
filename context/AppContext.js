import React, { useState, useContext, createContext } from 'react'
import { get, groupBy, reject, maxBy, minBy } from 'lodash'
import moment from 'moment'
import ExchangeAbi from '../lib/Exchange.json'
import TokenAbi from '../lib/Token.json'
import { ETHER_ADDRESS, ether, tokens, RED, GREEN } from './helper'
import {
  getFilledOrders,
  getAllOpenOrders,
  getMyFilledOrders,
  getMyOpenOrders,
} from './utils'

import { ethers } from 'ethers'

const AppContext = createContext()

export function useAppContext() {
  return useContext(AppContext)
}

export function AppContextProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false)
  const [connectedAddress, setConnectedAddress] = useState('')
  const [cancelledOrders, setCancelledOrders] = useState([])
  const [filledOrders, setFilledOrders] = useState([])
  const [allOrders, setAllOrders] = useState([])
  const [orderBook, setOrderBook] = useState({})
  const [myFilledOrders, setMyFilledOrders] = useState([])
  const [myOpenOrders, setMyOpenOrders] = useState([])

  const exchangeAddr = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
  const tokenAddr = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

  const getContract = (address, abi) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner(0)
    const contract = new ethers.Contract(address, abi, signer)

    return contract
  }

  // connecting the wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert('Please install Metamask!')
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      // setConnectedAddress(accounts)
      setConnectedAddress('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
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
        // setConnectedAddress(accounts[0])
        setConnectedAddress('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
      } else {
        connectWallet()
      }
    } catch (e) {
      console.log(e)
      throw new Error('No ethereum account!')
    }
  }

  // exchange functions
  const loadAllOrders = async (exchange) => {
    // Fetch cancelled orders with the "Cancel" event stream
    const cancelStream = await exchange.queryFilter(exchange.filters.Cancel())
    // Format cancelled orders
    let cancelledOrdersList = cancelStream.map((event) => event.args)
    cancelledOrdersList = cancelledOrdersList.sort(
      (a, b) => b.timestamp - a.timestamp
    )
    // Add cancelled orders to the cancelledOrders state
    setCancelledOrders(cancelledOrdersList)

    // Fetch filled orders with the "Trade" event stream
    const tradeStream = await exchange.queryFilter(exchange.filters.Trade())
    // Format filled orders
    let filledOrdersList = tradeStream.map((event) => event.args)

    filledOrdersList = getFilledOrders(filledOrdersList)
    // Add cancelled orders to filledOrders state
    setFilledOrders(filledOrdersList)

    // Load order stream
    const orderStream = await exchange.queryFilter(exchange.filters.Order())
    // Format order stream
    const allOrdersList = orderStream.map((event) => event.args)
    // Add open orders to the redux store
    setAllOrders(allOrdersList)

    const allOpenOrders = getAllOpenOrders(
      allOrdersList,
      filledOrdersList,
      cancelledOrdersList
    )

    setOrderBook(allOpenOrders)

    const myFilledOrdersList = getMyFilledOrders(
      connectedAddress,
      filledOrdersList
    )

    setMyFilledOrders(myFilledOrdersList)

    const myOpenOrdersList = getMyOpenOrders(connectedAddress, filledOrdersList)

    setMyOpenOrders(myOpenOrdersList)
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
    cancelledOrders,
    filledOrders,
    allOrders,
    orderBook,
    myFilledOrders,
    myOpenOrders,
  }

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}
