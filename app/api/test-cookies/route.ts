// app/api/test-cookies/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const cookies = request.cookies.getAll()
  
  return NextResponse.json({
    cookies: cookies.map(c => ({
      name: c.name,
      value: c.value ? `${c.value.substring(0, 10)}...` : 'empty',
      hasValue: !!c.value
    }))
  })
}