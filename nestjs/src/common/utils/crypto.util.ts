import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoUtil {
  /**
   * Generates a pair of RSA keys (public and private) using synchronous key generation.
   * Keys are returned in PEM format.
   *
   * @param {number} [modulusLength=2048] - Key size in bits (default: 2048)
   * @returns {{publicKey: string, privateKey: string}} Object containing PEM-formatted public and private keys
   * @throws {Error} When key generation fails
   */
  generateKeyPair(modulusLength: number = 2048): {
    publicKey: string;
    privateKey: string;
  } {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    return { publicKey, privateKey };
  }

  /**
   * Generates a cryptographically secure random string.
   * Uses crypto.randomBytes and converts to hexadecimal string.
   *
   * @param {number} [length=32] - Length of the random string in bytes (default: 32)
   * @returns {string} Hexadecimal-encoded random string (length * 2 characters)
   */
  generateRandomString(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generates a cryptographically secure random token.
   * Uses crypto.randomBytes and encodes as base64url (URL-safe base64).
   *
   * @param {number} [length=32] - Token length in bytes (default: 32)
   * @returns {string} Base64url-encoded random token string
   */
  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('base64url');
  }
}
