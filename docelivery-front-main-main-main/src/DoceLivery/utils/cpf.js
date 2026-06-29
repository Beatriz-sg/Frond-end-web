/**
 * Validates a Brazilian CPF using the official two-digit verification algorithm.
 *
 * - Strips dots and hyphens before validation.
 * - Rejects null, wrong length, and all-same-digit sequences.
 * - Returns true only for mathematically valid CPFs.
 *
 * Usage:
 *   import { isValidCpf } from '../utils/cpf';
 *   if (!isValidCpf(cpf)) { ... }
 */
export function isValidCpf(cpf) {
  if (!cpf) return false;

  // Strip formatting
  const digits = cpf.replace(/[.\-]/g, '');

  // Must be exactly 11 numeric digits
  if (!/^\d{11}$/.test(digits)) return false;

  // Reject repeated sequences: 00000000000 … 99999999999
  if (new Set(digits).size === 1) return false;

  // Validate both check digits
  return checkDigit(digits, 9) && checkDigit(digits, 10);
}

/**
 * Computes one CPF check digit and compares it to the actual digit at `position`.
 * @param {string} digits - 11-digit string (digits only)
 * @param {number} position - 9 for the first check digit, 10 for the second
 */
function checkDigit(digits, position) {
  let sum = 0;
  const weight = position + 1; // 10 for position 9, 11 for position 10

  for (let i = 0; i < position; i++) {
    sum += parseInt(digits[i]) * (weight - i);
  }

  const remainder = sum % 11;
  const expected = remainder < 2 ? 0 : 11 - remainder;
  const actual = parseInt(digits[position]);

  return expected === actual;
}
