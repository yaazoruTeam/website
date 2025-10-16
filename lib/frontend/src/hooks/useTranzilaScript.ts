import { useEffect, useState } from 'react'

interface UseTranzilaScriptReturn {
  isLoaded: boolean
  isLoading: boolean
  error: string | null
}

export const useTranzilaScript = (): UseTranzilaScriptReturn => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if script is already loaded
    if (window.TzlaHostedFields) {
      setIsLoaded(true)
      return
    }

    // Check if script is already in DOM
    const existingScript = document.querySelector('script[src*="tranzila"]')
    if (existingScript) {
      setIsLoading(true)
      
      const handleLoad = () => {
        setIsLoaded(true)
        setIsLoading(false)
      }
      
      const handleError = () => {
        setError('Failed to load Tranzila script')
        setIsLoading(false)
      }
      
      existingScript.addEventListener('load', handleLoad)
      existingScript.addEventListener('error', handleError)
      
      return () => {
        existingScript.removeEventListener('load', handleLoad)
        existingScript.removeEventListener('error', handleError)
      }
    }

    // Load the script
    setIsLoading(true)
    const script = document.createElement('script')
    script.src = 'https://direct.tranzila.com/js/v2/tranzila-hosted-fields.js'
    script.async = true
    
    const handleLoad = () => {
      if (window.TzlaHostedFields) {
        setIsLoaded(true)
        setError(null)
      } else {
        setError('TzlaHostedFields not available after script load')
      }
      setIsLoading(false)
    }
    
    const handleError = () => {
      setError('Failed to load Tranzila script')
      setIsLoading(false)
    }
    
    script.addEventListener('load', handleLoad)
    script.addEventListener('error', handleError)
    
    document.head.appendChild(script)
    
    return () => {
      script.removeEventListener('load', handleLoad)
      script.removeEventListener('error', handleError)
      // Don't remove the script from DOM to avoid reloading
    }
  }, [])

  return { isLoaded, isLoading, error }
}