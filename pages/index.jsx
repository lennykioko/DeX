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
    setConnectedAddress,
    connectedAddress,
    setExchange,
    setToken,
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
    fillOrder,
    loadBalances,
    etherBalance,
    tokenBalance,
    exchangeEtherBalance,
    exchangeTokenBalance,
    depositEther,
    withdrawEther,
    depositToken,
    withdrawToken
  } = useAppContext()

  useEffect(() => {
    const initialLoad = async () => {
      const currentConnectedAddress = await checkIfWalletIsConnected()
      setConnectedAddress(currentConnectedAddress)
      setIsLoading(true)
      const exchangeContract = await getContract(exchangeAddr, ExchangeAbi.abi)
      const tokenContract = await getContract(tokenAddr, TokenAbi.abi)
  
      setIsLoading(!exchangeContract && !tokenContract)
      await loadAllOrders(exchangeContract, currentConnectedAddress)
      setExchange(exchangeContract)
      setToken(tokenContract)
  
      await loadBalances(exchangeContract, tokenContract, currentConnectedAddress)
      setIsLoading(true)
    }

    initialLoad()
  }, [exchangeAddr, tokenAddr, ExchangeAbi, TokenAbi])

  return (
    <div className="min-w-screen min-h-screen bg-slate-800 text-white">
      <Head>
        <title>DeX</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header address={connectedAddress} />
      {isLoading ? (
        <div className="w-full flex-col md:grid md:grid-cols-4 md:grid-rows-2">
        <Balance
          etherBalance={etherBalance}
          tokenBalance={tokenBalance}
          exchangeEtherBalance={exchangeEtherBalance}
          exchangeTokenBalance={exchangeTokenBalance}
          depositEther={depositEther}
          exchange={exchange}
          withdrawEther={withdrawEther}
          depositToken={depositToken}
          withdrawToken={withdrawToken}
        />
        <OrderBook
          orderBook={orderBook}
          fillOrder={fillOrder}
          exchange={exchange}
        />
        <PriceChart priceChart={priceChart} />
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
      ): (
        <div>No data</div>
      )}
      
    </div>
  )
}

export default Home
