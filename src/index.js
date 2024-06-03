/**
 * Generates a UUIDv4.
 * @returns {string} The generated UUIDv4.
 */
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  /**
   * Generates a JWT (JSON Web Token) asynchronously.
   * @param {string} data - The data to include in the token.
   * @param {string} secret - The secret key to sign the token.
   * @param {number} expiresIn - The expiration time of the token in seconds.
   * @returns {Promise<string>} A promise that resolves with the generated JWT.
   */
  function generateJWT(data, secret, expiresIn) {
    return new Promise((resolve, reject) => {
      try {
        // Input data validation
        if (typeof data !== 'string' || typeof secret !== 'string' || typeof expiresIn !== 'number') {
          throw new Error('Arguments must be of the correct type');
        }
        
        const payload = {};
        payload.fresh = false;
        payload.iat = Math.floor(Date.now() / 1000);
        payload.jti = uuidv4(); 
        payload.type = "access"; 
        payload.sub = data; 
        payload.nbf = payload.iat; 
        payload.csrf = uuidv4(); 
        payload.exp = payload.iat + expiresIn; 
        const base64Payload = btoa(JSON.stringify(payload));
        const base64Header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const token = base64Header + '.' + base64Payload;
        signToken(token, secret)
          .then(signature => {
            const jwt = token + '.' + signature;
            resolve(jwt);
          })
          .catch(error => {
            console.error('Error generating token:', error);
            reject(error);
          });
      } catch (error) {
        console.error('Error generating token:', error);
        reject(error);
      }
    });
  }
  
  /**
   * Signs a token using a secret key asynchronously.
   * @param {string} token - The token to sign.
   * @param {string} secret - The secret key to sign the token.
   * @returns {Promise<string>} A promise that resolves with the token signature.
   */
  async function signToken(token, secret) {
    try {
      const secretBuffer = new TextEncoder().encode(secret);
      const secretKey = await crypto.subtle.importKey(
        'raw',
        secretBuffer,
        { name: 'HMAC', hash: { name: 'SHA-256' } },
        false,
        ['sign']
      );
      const signatureBuffer = await crypto.subtle.sign('HMAC', secretKey, new TextEncoder().encode(token));
      const signature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));
      return signature;
    } catch (error) {
      console.error('Error signing token:', error);
      throw error;
    }
  }
  
  module.exports = { generateJWT };
  