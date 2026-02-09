// app/test/page.tsx
'use client'

import { useState, useEffect } from 'react'

export default function TestPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const testAPI = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/about')
      const result = await res.json()
      console.log('API Response:', result)
      if (result.success) {
        setData(result.data)
      } else {
        setError(result.message)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testAPI()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>API Test</h1>
      <button onClick={testAPI} disabled={loading}>
        {loading ? 'Testing...' : 'Test API'}
      </button>
      
      {error && <div style={{ color: 'red', marginTop: '10px' }}>Error: {error}</div>}
      
      {data && (
        <div style={{ marginTop: '20px' }}>
          <h3>Company Name: {data.companyName}</h3>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}