function Transactions() {
  return (
    <div className="border-2 border-black">
      <div className="border-b-2 border-gray-900 p-4 text-xl">Transactions</div>
      <div>
        <button className="cursor-pointer border-b-2 border-b-sky-700 p-4">
          Trades
        </button>
        <button className="cursor-pointer p-4">Orders</button>
      </div>
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
            <tr>
              <th
                scope="row"
                className="border border-slate-700 py-1 font-normal text-gray-300"
              >
                3:11:04 pm 4/12
              </th>
              <td className="border border-slate-700 py-1">200</td>
              <td className="border border-slate-700 py-1">0.000075</td>
            </tr>

            <tr>
              <th
                scope="row"
                className="border border-slate-700 py-1 font-normal text-gray-300"
              >
                3:11:04 pm 4/12
              </th>
              <td className="border border-slate-700 py-1">200</td>
              <td className="border border-slate-700 py-1">0.000075</td>
            </tr>

            <tr>
              <th
                scope="row"
                className="border border-slate-700 py-1 font-normal text-gray-300"
              >
                3:11:04 pm 4/12
              </th>
              <td className="border border-slate-700 py-1">200</td>
              <td className="border border-slate-700 py-1">0.000075</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Transactions
