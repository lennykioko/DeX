import React, { useState, useContext, createContext } from 'react'
import { get, groupBy, reject, maxBy, minBy } from 'lodash'
import moment from 'moment'
import ExchangeAbi from '../lib/Exchange.json'
import TokenAbi from '../lib/Token.json'
import { ETHER_ADDRESS, ether, tokens, RED, GREEN } from './helper'

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
  const [,] = useState()

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
      setConnectedAddress(accounts)
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
        setConnectedAddress(accounts[0])
      } else {
        connectWallet()
      }
    } catch (e) {
      console.log(e)
      throw new Error('No ethereum account!')
    }
  }

  const decorateFilledOrders = (orders) => {
    // Track previous order to compare history
    let previousOrder = orders[0]
    return orders.map((order) => {
      order = decorateOrder(order)
      order = decorateFilledOrder(order, previousOrder)
      // previousOrder = order // Update the previous order once it's decorated
      return order
    })
  }

  const decorateOrder = (order) => {
    let etherAmount
    let tokenAmount

    if (order.tokenGive === ETHER_ADDRESS) {
      etherAmount = order.amountGive
      tokenAmount = order.amountGet
    } else {
      etherAmount = order.amountGet
      tokenAmount = order.amountGive
    }

    // Calculate token price to 5 decimal places
    const precision = 100000
    let tokenPrice = etherAmount / tokenAmount
    tokenPrice = Math.round(tokenPrice * precision) / precision

    return {
      ...order,
      etherAmount: ether(etherAmount),
      tokenAmount: tokens(tokenAmount),
      tokenPrice,
      formattedTimestamp: moment
        .unix(order.timestamp.toNumber())
        .format('h:mm:ss a M/D'),
    }
  }

  const decorateFilledOrder = (order, previousOrder) => {
    return {
      ...order,
      tokenPriceClass: tokenPriceClass(
        order.tokenPrice,
        order.id,
        previousOrder
      ),
    }
  }

  const tokenPriceClass = (tokenPrice, orderId, previousOrder) => {
    // Show green price if only one order exists
    if (previousOrder.id === orderId) {
      return GREEN
    }

    // Show green price if order price higher than previous order
    // Show red price if order price lower than previous order
    if (previousOrder.tokenPrice <= tokenPrice) {
      return GREEN // success
    } else {
      return RED // danger
    }
  }

  const openOrders = (all, filled, cancelled) => {
    const openOrders = reject(all, (order) => {
      const orderFilled = filled.some((ord) => ord.id === order.id)
      const orderCancelled = cancelled.some((ord) => ord.id === order.id)
      return orderFilled || orderCancelled
    })

    return openOrders
  }

  const decorateOrderBookOrders = (orders) => {
    return orders.map((order) => {
      order = decorateOrder(order)
      order = decorateOrderBookOrder(order)
      return order
    })
  }

  const decorateOrderBookOrder = (order) => {
    const orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'
    return {
      ...order,
      orderType,
      orderTypeClass: orderType === 'buy' ? GREEN : RED,
      orderFillAction: orderType === 'buy' ? 'sell' : 'buy',
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
    // Sort orders by date ascending for price comparison
    filledOrdersList = filledOrdersList.sort(
      (a, b) => a.timestamp - b.timestamp
    )
    // Decorate the orders
    filledOrdersList = decorateFilledOrders(filledOrdersList)
    // Sort orders by date descending for display
    filledOrdersList = filledOrdersList.sort(
      (a, b) => b.timestamp - a.timestamp
    )
    // Add cancelled orders to filledOrders state
    setFilledOrders(filledOrdersList)

    // Load order stream
    const orderStream = await exchange.queryFilter(exchange.filters.Order())
    // Format order stream
    const allOrdersList = orderStream.map((event) => event.args)
    // Add open orders to the redux store
    setAllOrders(allOrdersList)

    let allOpenOrders = openOrders(
      allOrdersList,
      filledOrdersList,
      cancelledOrdersList
    )
    // Decorate orders
    allOpenOrders = decorateOrderBookOrders(allOpenOrders)
    // Group orders by "orderType"
    allOpenOrders = groupBy(allOpenOrders, 'orderType')
    // Fetch buy orders
    const buyOrders = get(allOpenOrders, 'buy', [])
    // Sort buy orders by token price
    allOpenOrders = {
      ...allOpenOrders,
      buyOrders: buyOrders.sort((a, b) => b.tokenPrice - a.tokenPrice),
    }
    // Fetch sell orders
    const sellOrders = get(allOpenOrders, 'sell', [])
    // Sort sell orders by token price
    allOpenOrders = {
      ...allOpenOrders,
      sellOrders: sellOrders.sort((a, b) => b.tokenPrice - a.tokenPrice),
    }

    setOrderBook(allOpenOrders)
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
  }

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}
