/**
 * Loads the Google Maps API script dynamically
 * Uses import.meta.env.VITE_GOOGLE_MAPS_API_KEY which is automatically exposed by Vite
 */
export async function loadGoogleMapsAPI(): Promise<void> {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    throw new Error(
      'VITE_GOOGLE_MAPS_API_KEY environment variable is not set. ' +
      'Please configure it in your .env file or docker-compose configuration.'
    )
  }

  // Check if Google Maps is already loaded
  if (window.google?.maps) {
    return
  }

  // Create a promise that resolves when the script loads
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=maps,marker,places`
    script.async = true
    script.defer = true

    script.onload = () => resolve()
    script.onerror = () => {
      reject(
        new Error(
          'Failed to load Google Maps API. Please check your API key and network connection.'
        )
      )
    }

    document.head.appendChild(script)
  })
}
