import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type {
  TzlaHostedFieldsInstance,
  TzlaHostedFieldsOptions,
  TzlaHostedFieldsResponse,
  TzlaHostedFieldsError,
  ChargeData
} from '../tranzila'
import { colors } from '../styles/theme'
import { useTranzilaScript } from './useTranzilaScript'

interface UseTranzilaHostedFieldsProps {
  enabled?: boolean
  sandbox?: boolean
  onSuccess?: (response: TzlaHostedFieldsResponse) => void
  onError?: (errors: TzlaHostedFieldsError[]) => void
}

interface UseTranzilaHostedFieldsReturn {
  isInitialized: boolean
  isLoading: boolean
  error: string | null
  charge: (data: Omit<ChargeData, 'terminal_name'>) => Promise<TzlaHostedFieldsResponse>
  destroy: () => void
}

export const useTranzilaHostedFields = ({
  enabled = true,
  sandbox = true,
  onSuccess,
  onError
}: UseTranzilaHostedFieldsProps = {}): UseTranzilaHostedFieldsReturn => {
  const { t } = useTranslation()
  const { isLoaded: scriptLoaded, isLoading: scriptLoading, error: scriptError } = useTranzilaScript()
  
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fieldsInstanceRef = useRef<TzlaHostedFieldsInstance | null>(null)

  const terminalName = import.meta.env.VITE_TRANZILA_TERMINAL_NAME || 'yaazoru'

  const initializeFields = useCallback(() => {
    if (!enabled || !scriptLoaded || !window.TzlaHostedFields) {
      return
    }

    if (fieldsInstanceRef.current) {
      console.log('Tranzila fields already initialized')
      return
    }

    try {
      const options: TzlaHostedFieldsOptions = {
        sandbox,
        fields: {
          credit_card_number: {
            selector: '#credit_card_number',
            placeholder: t('creditcardNumber'),
            tabindex: 1,
          },
          cvv: {
            selector: '#cvv',
            placeholder: 'CVV',
            tabindex: 2,
          },
          expiry: {
            selector: '#expiry',
            placeholder: 'MM/YY',
            version: '1',
            tabindex: 3,
          },
          identity_number: {
            selector: '#identity_number',
            placeholder: t('IdNumber'),
            tabindex: 4,
          },
        },
        styles: {
          input: {
            height: '44px',
            width: '100%',
            color: colors.blue900,
            fontSize: '14px',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 12px',
          },
          select: {
            height: 'auto',
            width: 'auto',
          },
        },
      }

      fieldsInstanceRef.current = window.TzlaHostedFields.create(options)
      setIsInitialized(true)
      setError(null)
      console.log('Tranzila hosted fields initialized successfully')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Tranzila fields'
      setError(errorMessage)
      console.error('Failed to initialize Tranzila fields:', err)
    }
  }, [enabled, scriptLoaded, sandbox, t])

  const charge = useCallback(async (data: Omit<ChargeData, 'terminal_name'>): Promise<TzlaHostedFieldsResponse> => {
    return new Promise((resolve, reject) => {
      if (!fieldsInstanceRef.current) {
        const error = new Error('Tranzila fields not initialized')
        reject(error)
        return
      }

      const chargeData: ChargeData = {
        terminal_name: terminalName,
        ...data,
      }

      fieldsInstanceRef.current.charge(chargeData, (err, response) => {
        if (err) {
          console.error('Tranzila charge failed:', err)
          onError?.(err.messages)
          reject(err)
          return
        }

        if (response) {
          console.log('Tranzila charge successful:', response)
          onSuccess?.(response)
          resolve(response)
        } else {
          const error = new Error('No response received from Tranzila')
          reject(error)
        }
      })
    })
  }, [terminalName, onSuccess, onError])

  const destroy = useCallback(() => {
    if (fieldsInstanceRef.current) {
      try {
        fieldsInstanceRef.current.destroy()
        fieldsInstanceRef.current = null
        setIsInitialized(false)
        console.log('Tranzila fields destroyed')
      } catch (err) {
        console.error('Failed to destroy Tranzila fields:', err)
      }
    }
  }, [])

  // Initialize fields when script is loaded
  useEffect(() => {
    if (scriptLoaded && enabled) {
      initializeFields()
    }
  }, [scriptLoaded, enabled, initializeFields])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      destroy()
    }
  }, [destroy])

  const isLoading = scriptLoading || (!scriptLoaded && enabled)
  const combinedError = scriptError || error

  return {
    isInitialized,
    isLoading,
    error: combinedError,
    charge,
    destroy,
  }
}