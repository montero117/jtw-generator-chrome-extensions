# JWT Generator for Chrome Extensions

Generate JSON Web Tokens (JWT) for use in Chrome extensions with ease.


## Installation

You can install the package directly from the GitHub repository:

```
npm install montero117/jtw-generator-chrome-extensions
```

## Usage

The package provides a single function, `generateJWT`, which takes three parameters:

1. `data` (string): The data to be encoded
2. `secret` (string): The secret key to sign the token
3. `expiresIn` (number): The expiration time of the token in seconds

The function returns a promise that resolves with the generated JWT.

Here is an example of how to use the `generateJWT` function:

```
const { generateJWT } = require('jtw-generator-chrome-extensions');

const data = 'user@example.com';
const secret = 'your-secret-key';
const expiresIn = 3600; // Token expiration time in seconds

generateJWT(data, secret, expiresIn)
  .then(jwt => {
    console.log('Generated JWT:', jwt);
  })
  .catch(error => {
    console.error('Error generating JWT:', error);
  });
```