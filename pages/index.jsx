import Head from 'next/head'
import Balance from '../components/Balance'
import PriceChart from '../components/PriceChart'
import Header from '../components/Header'
import NewOrder from '../components/NewOrder'
import OrderBook from '../components/OrderBook'
import Trades from '../components/Trades'
import Transactions from '../components/Transactions'
import { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'

const Home = () => {
  const {
    isLoading,
    setIsLoading,
    checkIfWalletIsConnected,
    connectedAddress,
    setExchange,
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
    priceChart,
    exchange,
    cancelOrder,
    fillOrder
  } = useAppContext()

  useEffect(() => {
    checkIfWalletIsConnected()
    setIsLoading(true)
    const exchangeContract = getContract(exchangeAddr, ExchangeAbi.abi)
    const tokenContract = getContract(tokenAddr, TokenAbi.abi)

    setIsLoading(!exchangeContract && !tokenContract)
    loadAllOrders(exchangeContract)
    setExchange(exchangeContract)
    
  }, [exchangeAddr, tokenAddr, ExchangeAbi, TokenAbi])

  return (
    <div className="min-w-screen min-h-screen bg-slate-800 text-white">
      <Head>
        <title>DeX</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header address={connectedAddress} />
      <div className="w-full flex-col md:grid md:grid-cols-4 md:grid-rows-2">
        <Balance />
        <OrderBook orderBook={orderBook} fillOrder={fillOrder} exchange={exchange} />
        <PriceChart priceChart={priceChart}/>
        <Trades filledOrders={filledOrders} />
        <NewOrder />
        <Transactions
          myFilledOrders={myFilledOrders}
          myOpenOrders={myOpenOrders}
          exchange={exchange}
          cancelOrder={cancelOrder}
          account={connectedAddress}
        />
      </div>
    </div>
  )
}

export default Home
