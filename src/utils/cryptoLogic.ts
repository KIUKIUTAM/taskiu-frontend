// ==========================================
// 1. PKCE Utility Functions (Crypto Logic)
// ==========================================

// Generate random string (Code Verifier)
const generateCodeVerifier = (): string => {
  const array = new Uint8Array(32);
  globalThis.crypto.getRandomValues(array);
  return base64UrlEncode(array);
};

// Generate Code Challenge (SHA-256 hash of Verifier)
const generateCodeChallenge = async (verifier: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(new Uint8Array(digest));
};

// Base64URL Encoding (Replace + with -, / with _, remove =)
const base64UrlEncode = (array: Uint8Array): string => {
  let str = '';
  const bytes = Array.from(array);
  bytes.forEach((b) => (str += String.fromCharCode(b)));
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

// ==========================================
// 2. JWT Utility Functions
// ==========================================
// Helper function to decode Base64URL to ArrayBuffer
const base64UrlDecode = (input: string): Uint8Array => {
  // Replace URL-safe characters with Base64 characters
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  // Add padding if necessary
  const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  // Decode Base64 to binary
  const binaryString = atob(paddedBase64);
  // Convert binary string to Uint8Array
  const buffer = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    buffer[i] = binaryString.charCodeAt(i);
  }
  return buffer;
};

// Verify JWT signature
const verifyJwt = async (token: string, secret: string): Promise<boolean> => {
  try {
    // Split the token into its components
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const message = `${encodedHeader}.${encodedPayload}`;

    // Prepare the secret key for HMAC
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const key = await globalThis.crypto.subtle.importKey(
      'raw',
      keyData as BufferSource,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    );

    // Decode the signature from Base64URL
    const signatureBytes = base64UrlDecode(encodedSignature);

    // Verify the HMAC signature
    const isValid = await globalThis.crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes as BufferSource,
      encoder.encode(message) as BufferSource,
    );

    return isValid;
  } catch (error) {
    console.error('Error verifying JWT:', error);
    return false; // Return false if any error occurs
  }
};

export { generateCodeVerifier, generateCodeChallenge };
