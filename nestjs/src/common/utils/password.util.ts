import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';

@Injectable()
export class PasswordUtil {
  constructor(private configService: ConfigService) {}

  /**
   * Hashes a password using Argon2id algorithm.
   * Uses configuration from environment variables (memory cost, time cost, parallelism).
   *
   * @param {string} password - Plain text password to hash
   * @returns {Promise<string>} Argon2 hashed password string
   * @throws {Error} When hashing fails or configuration is invalid
   */
  async hashPassword(password: string): Promise<string> {
    const memoryCost = this.configService.get<number>('ARGON2_MEMORY_COST') || 65536;
    const timeCost = this.configService.get<number>('ARGON2_TIME_COST') || 3;
    const parallelism = this.configService.get<number>('ARGON2_PARALLELISM') || 1;

    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost,
      timeCost,
      parallelism,
    });
  }

  /**
   * Verifies a plain text password against an Argon2 hash.
   * Returns false if verification fails or an error occurs.
   *
   * @param {string} hash - Argon2 hashed password string
   * @param {string} password - Plain text password to verify
   * @returns {Promise<boolean>} True if password matches the hash, false otherwise
   */
  async verifyPassword(hash: string, password: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch (error) {
      return false;
    }
  }

  /**
   * Derives a cryptographic key from a password using Argon2.
   * This can be used to generate encryption keys from user passwords.
   * If no salt is provided, a random salt will be generated.
   *
   * @param {string} password - Password to derive key from
   * @param {Buffer} [salt] - Optional salt buffer (if not provided, will be generated randomly)
   * @param {number} [keyLength=32] - Desired key length in bytes (default: 32)
   * @returns {Promise<{key: Buffer, salt: Buffer}>} Object containing the derived key and salt buffers
   * @throws {Error} When key derivation fails or configuration is invalid
   */
  async deriveKeyFromPassword(
    password: string,
    salt?: Buffer,
    keyLength: number = 32,
  ): Promise<{ key: Buffer; salt: Buffer }> {
    const memoryCost = this.configService.get<number>('ARGON2_MEMORY_COST') || 65536;
    const timeCost = this.configService.get<number>('ARGON2_TIME_COST') || 3;
    const parallelism = this.configService.get<number>('ARGON2_PARALLELISM') || 1;

    // Generate salt if not provided
    const keySalt = salt || Buffer.from(crypto.randomBytes(16));

    // Use Argon2 to derive key from password
    const key = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost,
      timeCost,
      parallelism,
      salt: keySalt,
      raw: true, // Return raw buffer instead of encoded string
    });

    // Truncate or pad to desired length
    const derivedKey = Buffer.alloc(keyLength);
    key.copy(derivedKey, 0, 0, Math.min(key.length, keyLength));

    return { key: derivedKey, salt: keySalt };
  }
}
