// app/api/debug/types/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const VALID_TYPES = ['privacy_policy', 'terms_of_service', 'cookie_policy'] as const;
  
  const testTypes = ['privacy_policy', 'terms_of_service', 'cookie_policy', 'privacy-policy', 'PRIVACY_POLICY'];
  
  const results = testTypes.map(type => ({
    type,
    isValid: VALID_TYPES.includes(type as any),
    typeOf: typeof type
  }));
  
  return NextResponse.json({
    success: true,
    validTypes: VALID_TYPES,
    testResults: results
  });
}