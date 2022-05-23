import Head from 'next/head'

const Home = () => {
  return (
    <div className="min-w-screen min-h-screen flex-col items-center justify-center bg-slate-800 text-white">
      <Head>
        <title>DeX</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  )
}

export default Home
