/**
 * Security configuration and utilities for the Free Craps application
 */

// Content Security Policy configuration
export const configureCSP = () => {
  // Only apply in production
  if (process.env.NODE_ENV === 'production') {
    // Create CSP meta tag
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    
    // Define CSP directives
    const cspContent = [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'", // Allow inline styles for React
      "img-src 'self' data:", // Allow data URLs for images
      "connect-src 'self' https://storage.googleapis.com", // Allow connection to GCS if needed
      "font-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'", // Prevent iframe embedding
      "block-all-mixed-content", // Prevent mixed content
      "upgrade-insecure-requests" // Upgrade HTTP to HTTPS
    ].join('; ');
    
    cspMeta.content = cspContent;
    document.head.appendChild(cspMeta);
  }
};

// Configure security headers for fetch requests
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

// Secure fetch wrapper
export const secureFetch = (url, options = {}) => {
  // Add security headers to request
  const secureOptions = {
    ...options,
    headers: {
      ...options.headers,
      ...securityHeaders
    }
  };
  
  return fetch(url, secureOptions);
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Initialize all security features
export const initSecurity = () => {
  configureCSP();
  
  // Log security initialization in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    console.log('Security features initialized in development mode');
  }
};