import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Returns a 401 Unauthorized response with WWW-Authenticate header
 */
function unauthorizedResponse(message = 'Authentication required'): NextResponse {
  return new NextResponse(message, {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Dashboard"',
    },
  });
}

export async function middleware(request: NextRequest) {
  // Check if auth is enabled
  const authEnabled = process.env.AUTH_ENABLED !== 'false';

  if (!authEnabled) {
    return NextResponse.next();
  }

  // Get credentials from environment
  const expectedUsername = process.env.AUTH_USERNAME;
  const expectedPasswordHash = process.env.AUTH_PASSWORD_HASH;

  // Validate environment configuration
  if (!expectedUsername || !expectedPasswordHash) {
    console.error('AUTH_USERNAME or AUTH_PASSWORD_HASH not configured');
    return new NextResponse('Authentication not configured', { status: 500 });
  }

  // Get Authorization header
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return unauthorizedResponse('Missing Authorization header');
  }

  if (!authHeader.startsWith('Basic ')) {
    return unauthorizedResponse('Invalid authentication scheme. Expected Basic Auth');
  }

  // Decode credentials
  const base64Credentials = authHeader.slice(6); // Remove 'Basic ' prefix
  let credentials: string;

  try {
    credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  } catch (error) {
    return unauthorizedResponse('Failed to decode Base64 credentials');
  }

  const [username, password] = credentials.split(':');

  // Validate username and password exist
  if (!username) {
    return unauthorizedResponse('Username is empty');
  }

  if (!password) {
    return unauthorizedResponse('Password is empty');
  }

  // Check username
  if (username !== expectedUsername) {
    return unauthorizedResponse('Invalid username');
  }

  // Validate password using SHA-256
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  const passwordMatch = passwordHash === expectedPasswordHash;

  if (!passwordMatch) {
    return unauthorizedResponse('Invalid password');
  }

  // Authentication successful
  return NextResponse.next();
}

// Configure which routes to protect
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
