import { listen } from '@ledgerhq/logs'
import { createClient, getSupportedTransport, setDebugLogging } from 'near-ledger-js'
import { useCallback, useEffect, useRef, useState } from 'react'

setDebugLogging(true)
listen(console.log)

const useLedger = () => {
  const [available, setAvailable] = useState(false)
  const transportRef = useRef<any>()
  const clientRef = useRef<any>()

  const connect = useCallback(connectFn, [])
  const getVersion = useCallback(getVersionFn, [])
  const getPublicKey = useCallback(getPublicKeyFn, [])
  const sign = useCallback(signFn, [])

  useEffect(() => {
    console.log('effect!')
    connect()

    return () => {
      console.log('delete effect!')
      const transport = transportRef.current
      if (transport) {
        if (transport.close) {
          console.log('Closing transport')
          try {
            transport.close && transport.close()
          } catch (e) {
            console.warn('Failed to close existing transport', e)
          } finally {
            transport.off('disconnect', handleDisconnect)
          }
        }
      }
    }
  }, [connect])

  return { available, getVersion, getPublicKey, sign }

  function handleDisconnect() {
    console.log('disconnected')
  }

  async function connectFn() {
    try {
      transportRef.current = await getSupportedTransport()
      transportRef.current.setScrambleKey('NEAR')
      transportRef.current.on('disconnect', handleDisconnect)

      clientRef.current = await createClient(transportRef.current)
      setAvailable(true)
    } catch (e: any) {
      console.log('error', e.message)
    }
  }

  async function getVersionFn() {
    if (clientRef.current) {
      return clientRef.current.getVersion()
    }
  }

  async function getPublicKeyFn(path?: string) {
    if (clientRef.current) {
      return (await clientRef.current.getPublicKey(path)) as Buffer
    }
  }

  async function signFn(transactionData: any, path?: string) {
    if (clientRef.current) {
      return clientRef.current.sign(transactionData, path)
    }
  }
}

export default useLedger
