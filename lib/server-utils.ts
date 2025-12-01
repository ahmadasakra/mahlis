import { headers } from 'next/headers';

/**
 * Get the base URL for server-side API calls
 * Optimized for Heroku deployment
 * 
 * For Heroku, set the environment variable (recommended):
 * heroku config:set NEXT_PUBLIC_BASE_URL=https://www.ritamahlis.com --app mahlis
 * 
 * Or use the Heroku app URL:
 * heroku config:set NEXT_PUBLIC_BASE_URL=https://mahlis-63c306311545.herokuapp.com --app mahlis
 * 
 * NOTE: This function can only be used in Server Components, not Client Components
 */
export async function getBaseUrl() {
  // First, check for explicit environment variable (recommended for Heroku)
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  // For server-side rendering, try to get from request headers
  try {
    const headersList = await headers();
    const host = headersList.get('host');
    // Heroku sets x-forwarded-proto header
    const protocol = headersList.get('x-forwarded-proto') || 'https';
    
    if (host) {
      // Heroku always uses HTTPS in production
      // Check for both custom domain and herokuapp.com domain
      if (host.includes('herokuapp.com') || host.includes('ritamahlis.com')) {
        return `https://${host}`;
      }
      // Use protocol from header (Heroku sets this)
      return `${protocol}://${host}`;
    }
  } catch {
    // If headers() fails (e.g., during build), fall back to environment variables
    console.warn('Could not get headers, using fallback URL');
  }
  
  // Fallback: Check for Heroku-specific environment variables
  // Heroku sets DYNO environment variable, but not the app name directly
  // Try common Heroku environment variables
  if (process.env.HEROKU_APP_NAME) {
    return `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`;
  }
  
  // Default to localhost for development
  return 'http://localhost:3000';
}

