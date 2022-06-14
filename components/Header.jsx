import { useState, useEffect } from 'react'

function Header({ address }) {
  const [displayAddress, setDisplayAddress] = useState('')
  const [isMobile, setIsMobile] = useState(true)

  // placeholder to be deleted soon
  address = '0x065e3DbaFCb2C26A978720f9eB4Bce6aD9D644a1'

  useEffect(() => {
    setIsMobile(window.innerWidth <= 760)

    if (isMobile) {
      address &&
        setDisplayAddress(`${address.slice(0, 4)}...${address.slice(38)}`)
    } else {
      address && setDisplayAddress(address)
    }
  }, [isMobile])

  return (
    <div className="flex items-center justify-between border-2 border-black bg-sky-900 p-4">
      <div className="text-xl">DApp Token Exchange</div>
      <div className=" text-gray-300">{displayAddress}</div>
    </div>
  )
}

export default Header
