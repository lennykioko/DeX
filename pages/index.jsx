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
  } = useAppContext()

  useEffect(() => {
    checkIfWalletIsConnected()
    setIsLoading(true)
    const exchange = getContract(exchangeAddr, ExchangeAbi.abi)
    const token = getContract(tokenAddr, TokenAbi.abi)

    setIsLoading(!exchange && !token)
    loadAllOrders(exchange)
    
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
        <OrderBook orderBook={orderBook} />
        <PriceChart />
        <Trades filledOrders={filledOrders} />
        <NewOrder />
        <Transactions
          myFilledOrders={myFilledOrders}
          myOpenOrders={myOpenOrders}
        />
      </div>
    </div>
  )
}

export default Home
