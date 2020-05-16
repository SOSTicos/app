import { createContext, useMemo, useState, useEffect } from 'react'
import api from '../data'

const initialState = {
  isAuth: false,
  loading: true,
}

export const Context = createContext(initialState)

const Provider = ({ apiKey, ...props }) => {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    restoreSession()
  }, [])

  const restoreSession = async () => {
    let isAuth = false

    try {
      isAuth = await api.auth.isAuth()
    } catch (error) {
      console.log(error)
    }

    setState({ isAuth, loading: false })
  }

  const value = useMemo(() => ({ ...state, ...api }), [api, state])

  return <Context.Provider {...props} value={value} />
}

export default Provider
