function NewOrder() {
  // Validate the inputs in the input fields using this function
  // having input type number looks ugly
  const isNumber = (n) => {
    try {
      const num = parseFloat(n)
      return !isNaN(num)
    } catch (error) {
      console.log(`invalid input for n: ${n}`)
    }
  }

  // need to set state for buy or sell and toggle the names and color of buttons on toggle
  return (
    <div className="border-2 border-black">
      <div className="border-b-2 border-gray-900 p-4 text-xl">NewOrder</div>
      <ul
        class="nav nav-tabs mb-4 flex list-none flex-col flex-wrap border-b-0 pl-0 md:flex-row"
        id="tabs-tab"
        role="tablist"
      >
        <li class="nav-item" role="presentation">
          <a
            href="#tabs-buy"
            class="
            nav-link
            active
            my-2
            block
            border-x-0 border-t-0 border-b-2 border-transparent
            px-6
            py-3
            uppercase
            leading-tight hover:border-transparent
            hover:bg-gray-100
            focus:border-b-sky-700
          "
            id="tabs-buy-tab"
            data-bs-toggle="pill"
            data-bs-target="#tabs-buy"
            role="tab"
            aria-controls="tabs-buy"
            aria-selected="true"
          >
            Buy
          </a>
        </li>
        <li class="nav-item" role="presentation">
          <a
            href="#tabs-sell"
            class="
            nav-link
            my-2
            block
            border-x-0
            border-t-0
            border-b-2 border-transparent px-6 py-3
            font-medium
            uppercase
            leading-tight
            hover:border-transparent hover:bg-gray-100
            focus:border-transparent
          "
            id="tabs-sell-tab"
            data-bs-toggle="pill"
            data-bs-target="#tabs-sell"
            role="tab"
            aria-controls="tabs-sell"
            aria-selected="false"
          >
            Sell
          </a>
        </li>
      </ul>
      <div class="tab-content" id="tabs-tabContent">
        <div
          class="active show tab-pane fade"
          id="tabs-buy"
          role="tabpanel"
          aria-labelledby="tabs-buy-tab"
        >
          <div className="flex-col p-4">
            <label htmlFor="buyAmount">Buy Amount (DAPP)</label>
            <input
              className="my-2 block rounded-lg bg-gray-700 p-2 focus:outline-none"
              type="text"
              name="buyAmount"
              id="buyAmount"
              placeholder="Buy Amount"
            />

            <label htmlFor="buyPrice">Buy Price</label>
            <input
              className="my-2 block rounded-lg bg-gray-700 p-2 focus:outline-none"
              type="text"
              name="buyPrice"
              id="buyPrice"
              placeholder="Buy Price"
            />
            <button className="ml-2 rounded-lg bg-green-800 p-2">
              Buy Order
            </button>
          </div>
        </div>
        <div
          class="fade tab-pane"
          id="tabs-sell"
          role="tabpanel"
          aria-labelledby="tabs-sell-tab"
        ></div>
      </div>
    </div>
  )
}

export default NewOrder
