import * as crypto from 'crypto';

export function randomString(length: number): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateHash(
  suffix: string,
  prefix = '0xB',
  totalLength = 52,
): string {
  const randomLen = totalLength - prefix.length - suffix.length;
  const randomPart = crypto
    .randomBytes(Math.ceil(randomLen / 2))
    .toString('hex')
    .slice(0, randomLen);
  return prefix + randomPart + suffix;
}

