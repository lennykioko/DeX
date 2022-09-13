function Trades({
  filledOrders
}) {
  return (
    <div className="row-span-6 border-2 border-black">
      <div className="border-b-2 border-gray-900 p-4 text-xl">Trades</div>
      <div className="w-full">
        <table className="w-full table-auto border-collapse text-center">
          <thead>
            <tr>
              <th scope="col" className="border border-slate-700 py-2">
                Time
              </th>
              <th scope="col" className="border border-slate-700 py-2">
                DAPP
              </th>
              <th scope="col" className="border border-slate-700 py-2">
                DAPP/ETH
              </th>
            </tr>
          </thead>
          <tbody>

            {filledOrders.map((order) => {
              return (
                <tr key={order.id.toNumber() + order.timestamp.toNumber()}>
                  <th
                    scope="row"
                    className="border border-slate-700 py-1 font-normal text-gray-400"
                  >
                    {order.formattedTimestamp}
                  </th>
                  <td className="border border-slate-700 py-1">{order.tokenAmount}</td>
                  <td className={`border border-slate-700 py-1 text-${order.tokenPriceClass}-500`}>{order.tokenPrice}</td>
                </tr>
              )
            })}

          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Trades
