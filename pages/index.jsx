import Head from 'next/head'
import { useEffect, useState } from 'react'
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
  } = useAppContext()

  useEffect(() => {
    checkIfWalletIsConnected()
    const exchange = getContract(exchangeAddr,ExchangeAbi.abi)
    
    // console.log(exchange.filters.Cancel())
    // const exchange = getContract(TokenAbi, tokenAddr)
    loadAllOrders(exchange)
  }, [exchangeAddr, tokenAddr, ExchangeAbi, TokenAbi])
  console.log(isLoading)

  return (
    <div className="min-w-screen min-h-screen flex-col items-center justify-center bg-slate-800 text-white">
      <Head>
        <title>DeX</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="m-5 flex h-20 w-20 p-2">
        <button
          className="m-5 bg-green-400 p-5 "
          onClick={() => setIsLoading(true)}
        >
          Toggle
        </button>
      </div>
    </div>
  )
}

export default Home
