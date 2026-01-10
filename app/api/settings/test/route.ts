// app/api/settings/test/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'API is working',
    testSettings: {
      business: {
        name: 'Test Business',
        taxRate: 18,
        invoicePrefix: 'INV',
        gstNumber: 'TEST123',
        businessAddress: 'Test Address',
        phone: '9876543210',
        email: 'test@example.com',
        website: '',
        logoUrl: ''
      }
    }
  })
}