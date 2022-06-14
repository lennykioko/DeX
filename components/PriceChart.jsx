import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })
import { chartOptions } from '../config/priceChart.config'

function PriceChart({ priceChart, priceChartLoaded }) {
  const priceSymbol = (lastPriceChange) => {
    if (lastPriceChange === '+') {
      return <span className="text-green-500">&#9650;</span>
    } else {
      return <span className="text-rose-500">&#9660;</span>
    }
  }

  return (
    <div className="border-2 border-black">
      <div className="border-b-2 border-gray-900 p-4 text-xl">Chart</div>
      <div>
        <div className="p-4 text-lg font-bold">
          DAPP/ETH &nbsp; {priceSymbol('+')} &nbsp; {`0.00075`}
        </div>

        {/* Pricechart data is required from redux I guess */}

        {/* {typeof window !== 'undefined' && (
          <Chart
            options={chartOptions}
            series={priceChart.series}
            type="candlestick"
            width="100%"
            height="100%"
          />
        )} */}
      </div>
    </div>
  )
}

export default PriceChart
