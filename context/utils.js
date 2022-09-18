import { get, groupBy, reject, maxBy, minBy } from 'lodash'
import moment from 'moment'
import { ETHER_ADDRESS, ether, tokens, RED, GREEN } from './helper'

// Filled orders

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

const decorateFilledOrder = (order, previousOrder) => {
  return {
    ...order,
    tokenPriceClass: tokenPriceClass(order.tokenPrice, order.id, previousOrder),
  }
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

export const getFilledOrders = (filledOrdersList) => {
  filledOrdersList.sort((a, b) => a.timestamp - b.timestamp)
  // Decorate the orders
  filledOrdersList = decorateFilledOrders(filledOrdersList)
  // Sort orders by date descending for display
  filledOrdersList.sort((a, b) => b.timestamp - a.timestamp)
  return filledOrdersList
}

// All open orders

const openOrders = (all, filled, cancelled) => {
  const openOrders = reject(all, (order) => {
    const orderFilled = filled.some((ord) => ord.id === order.id)
    const orderCancelled = cancelled.some((ord) => ord.id === order.id)
    return orderFilled || orderCancelled
  })

  return openOrders
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

const decorateOrderBookOrders = (orders) => {
  return orders.map((order) => {
    order = decorateOrder(order)
    order = decorateOrderBookOrder(order)
    return order
  })
}

export const getAllOpenOrders = (
  allOrdersList,
  filledOrdersList,
  cancelledOrdersList
) => {
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

  return allOpenOrders
}

// My Filled Orders
const decorateMyFilledOrders = (orders, account) => {
  return orders.map((order) => {
    order = decorateOrder(order)
    order = decorateMyFilledOrder(order, account)
    return order
  })
}

const decorateMyFilledOrder = (order, account) => {
  const myOrder = order.user === account

  let orderType
  if (myOrder) {
    orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'
  } else {
    orderType = order.tokenGive === ETHER_ADDRESS ? 'sell' : 'buy'
  }

  return {
    ...order,
    orderType,
    orderTypeClass: orderType === 'buy' ? GREEN : RED,
    orderSign: orderType === 'buy' ? '+' : '-',
  }
}

export const getMyFilledOrders = (account, filledOrders) => {
  // Find our filledOrders
  filledOrders = filledOrders.filter(
    (order) => order.user === account || order.userFill === account
  )

  // Sort by date ascending
  filledOrders = filledOrders.sort((a, b) => a.timestamp - b.timestamp)

  // Decorate filledOrders - add display attributes
  filledOrders = decorateMyFilledOrders(filledOrders, account)
  return filledOrders
}

// My open orders

export const getMyOpenOrders = (account, orders) => {
  // Filter orders created by current account
  orders = orders.filter((order) => order.user === account)
  // Decorate orders - add display attributes
  orders = decorateMyOpenOrders(orders)

  // Sort orders by date descending
  orders = orders.sort((a, b) => b.timestamp - a.timestamp)
  return orders
}

const decorateMyOpenOrders = (orders, account) => {
  return orders.map((order) => {
    order = decorateOrder(order)
    order = decorateMyOpenOrder(order, account)
    return order
  })
}

const decorateMyOpenOrder = (order, account) => {
  let orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'

  return {
    ...order,
    orderType,
    orderTypeClass: orderType === 'buy' ? GREEN : RED,
  }
}

export const getPriceChart = (orders) => {
  // Sort orders by date ascending to compare history
  orders = orders.sort((a, b) => a.timestamp - b.timestamp)
  // Decorate orders - add display attributes
  orders = orders.map((o) => decorateOrder(o))
  // Get last 2 order for final price & price change
  let secondLastOrder, lastOrder
  ;[secondLastOrder, lastOrder] = orders.slice(orders.length - 2, orders.length)
  // get last order price
  const lastPrice = get(lastOrder, 'tokenPrice', 0)
  // get second last order price
  const secondLastPrice = get(secondLastOrder, 'tokenPrice', 0)

  return {
    lastPrice,
    lastPriceChange: lastPrice >= secondLastPrice ? '+' : '-',
    series: [
      {
        data: buildGraphData(orders),
      },
    ],
  }
}

const buildGraphData = (orders) => {
  // Group the orders by hour for the graph
  orders = groupBy(orders, (order) =>
    moment.unix(order.timestamp).startOf('hour').format()
  )
  // Get each hour where data exists
  const hours = Object.keys(orders)
  // Build the graph series
  const graphData = hours.map((hour) => {
    // Fetch all the orders from current hour
    const group = orders[hour]
    // Calculate price values - open, high, low, close
    const open = group[0] // first order
    const high = maxBy(group, 'tokenPrice') // high price
    const low = minBy(group, 'tokenPrice') // low price
    const close = group[group.length - 1] // last order

    return {
      x: new Date(hour),
      y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice],
    }
  })

  return graphData
}
