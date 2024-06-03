declare module 'jtw-generator-chrome-extensions' {
    export function generateJWT(payload: any, secret: string, expiresIn: number): Promise<string>;
  }