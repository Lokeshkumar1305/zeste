import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

 constructor() { }

  private secretKey = 'TOUISS#$f5345c8c9fd30cb9CHK3097#';

  encrypt(text: string): any {
    try {
      const key = CryptoJS.enc.Utf8.parse(this.secretKey);
      const encrypted = CryptoJS.AES.encrypt(text, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      return encrypted.toString();
    } catch (e) {
      console.error('Error while encrypting:', e);
      return null;
    }
  }


  decrypt(ciphertext: string): string | null {
    try {
      const key = CryptoJS.enc.Utf8.parse(this.secretKey);
      const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (e) {
      console.error('Error while decrypting:', e);
      return null;
    }
  }


}
