import React, { useState, useContext, createContext } from 'react'

const AppContext = createContext()

export function useAppContext() {
  return useContext(AppContext)
}

export function AppContextProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false)

  const context = {
    isLoading,
    setIsLoading,
  }

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}
