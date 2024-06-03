function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  function generateJWT(data, secret, expiresIn) {
    return new Promise((resolve, reject) => {
      try {
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
            console.error('Error al generar el token:', error);
            reject(error);
          });
      } catch (error) {
        console.error('Error al generar el token:', error);
        reject(error);
      }
    });
  }
  
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
      console.error('Error al firmar el token:', error);
      throw error;
    }
  }
  
  
  module.exports = { generateJWT};
  