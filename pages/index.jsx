import Head from 'next/head'
import Balance from '../components/Balance'
import PriceChart from '../components/PriceChart'
import Header from '../components/Header'
import NewOrder from '../components/NewOrder'
import OrderBook from '../components/OrderBook'
import Trades from '../components/Trades'
import Transactions from '../components/Transactions'
import { useAppContext } from '../context/AppContext'

const Home = () => {
  const { isLoading, setIsLoading } = useAppContext()

  return (
    <div className="min-w-screen min-h-screen bg-slate-800 text-white">
      <Head>
        <title>DeX</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <div className="w-full flex-col md:grid md:grid-cols-4 md:grid-rows-2">
        <Balance />
        <OrderBook />
        <PriceChart />
        <Trades />
        <NewOrder />
        <Transactions />
      </div>
    </div>
  )
}

export default Home
