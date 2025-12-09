import { NextResponse } from 'next/server';

/**
 * CORS Headers für API Responses
 * Erlaubt Anfragen von allen Origins (in Production sollte das spezifischer sein)
 */
export function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

/**
 * OPTIONS Handler für CORS Preflight Requests
 */
export function handleCorsPreflight(): NextResponse {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response);
}



