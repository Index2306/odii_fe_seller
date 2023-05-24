import CryptoJS from 'crypto-js';

export function saveToken(tokens: object) {
  try {
    const value = CryptoJS.AES.encrypt(JSON.stringify(tokens), 'token_seller');
    window.localStorage && localStorage.setItem('accessTokenSeller', value);
  } catch (error) {
    console.log(`saveToken`, error);
  }
}

/* istanbul ignore next line */
export function getTokenFromStorage() {
  try {
    const item = window.localStorage
      ? (localStorage.getItem('accessTokenSeller') as string) || ''
      : '';
    if (!item) return '';
    const value = CryptoJS.AES.decrypt(item, 'token_seller').toString(
      CryptoJS.enc.Utf8,
    );
    return JSON.parse(value);
  } catch (error) {
    console.log(`getTokenFromStorage`, error);
  }
}
