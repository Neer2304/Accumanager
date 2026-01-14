// lib/api-response.ts
import { NextResponse } from 'next/server'

export class ApiResponse {
  static success(data: any = null, message: string = 'Success') {
    return NextResponse.json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    })
  }

  static error(message: string = 'Error', status: number = 400, code?: string) {
    return NextResponse.json({
      success: false,
      message,
      code: code || this.getErrorCode(status),
      timestamp: new Date().toISOString()
    }, { status })
  }

  static unauthorized(message: string = 'Unauthorized') {
    return this.error(message, 401, 'UNAUTHORIZED')
  }

  static forbidden(message: string = 'Forbidden') {
    return this.error(message, 403, 'FORBIDDEN')
  }

  static notFound(message: string = 'Not found') {
    return this.error(message, 404, 'NOT_FOUND')
  }

  static validationError(errors: any, message: string = 'Validation failed') {
    return NextResponse.json({
      success: false,
      message,
      code: 'VALIDATION_ERROR',
      errors,
      timestamp: new Date().toISOString()
    }, { status: 422 })
  }

  private static getErrorCode(status: number): string {
    const codes: { [key: number]: string } = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_ERROR',
      503: 'SERVICE_UNAVAILABLE'
    }
    return codes[status] || 'UNKNOWN_ERROR'
  }
}