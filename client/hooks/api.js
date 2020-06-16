import { useContext, useRef, useReducer, useMemo, useEffect } from 'react'
import isEmail from 'is-email'
import { Context } from '../components/provider'
import * as tokens from '../../shared/lib/tokens'
import api from '../data'

const initialState = {
  email: null,
  code: null,
  isAuth: false,
  expired: false,
  verifying: false,
}

const reducer = (state, data) => {
  return { ...state, ...data }
}

const useApi = (parameters = {}) => {
  const timer = useRef(null)
  const context = useContext(Context)
  const [state, setState] = useReducer(reducer, initialState)

  useEffect(() => {
    setState({ isAuth: context.isAuth })
  }, [context.isAuth])

  const startVerification = (data) => {
    timer.current = setInterval(verify, 3000, data)
  }

  const verify = async ({ expires, ...data }) => {
    try {
      if (Date.now() > expires) {
        setState({ expired: true })
        return cancel()
      }

      const { token } = await api.auth.verify(data)
      tokens.set(token)
      cancel()
      setState({ isAuth: true })
    } catch (error) {
      console.log('ERROR', error)
    }
  }

  const signin = async (email) => {
    if (!isEmail(email)) throw new Error('Email inválido')

    try {
      setState({ expired: false, verifying: true })
      const creds = await api.auth.signin(email)
      setState(creds)
      startVerification(creds)
    } catch {
      cancel()
    }

    return () => cancel()
  }

  const cancel = () => {
    clearInterval(timer.current)
    setState({ verifying: false, code: null })
  }

  const signout = () => {
    api.auth.signout()
  }

  useEffect(() => {
    if ('user' in parameters) {
      setState({ isAuth: Boolean(parameters.user), user: parameters.user })
    }
  }, [parameters])

  return useMemo(() => ({ ...context, ...state, signin, signout, cancel }), [state, context])
}

export default useApi
