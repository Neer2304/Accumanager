// components/TestApiResponse.tsx
import { useState } from 'react'

export const TestApiResponse = () => {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testApi = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/projects', {
        credentials: 'include'
      })
      const data = await response.json()
      setResult({
        status: response.status,
        ok: response.ok,
        data,
        headers: Object.fromEntries(response.headers.entries())
      })
    } catch (error) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <button onClick={testApi} disabled={loading}>
        {loading ? 'Testing...' : 'Test /api/projects'}
      </button>
      {result && (
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          marginTop: '10px',
          overflow: 'auto',
          maxHeight: '400px'
        }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}