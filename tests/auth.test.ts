import { describe, expect, it } from 'vitest';
import { createPasswordResetToken, hashPassword, hashPasswordResetToken, validatePasswordPolicy, verifyPassword } from '../src/lib/auth/password';
import { createSessionToken, verifySessionToken } from '../src/lib/auth/session';

describe('password helpers', () => {
  it('enforces a basic password policy', () => {
    expect(validatePasswordPolicy('short1')).toContain('Password must be at least 10 characters.');
    expect(validatePasswordPolicy('longbutnonumeric')).toContain('Password must include at least one number.');
    expect(validatePasswordPolicy('1234567890')).toContain('Password must include at least one letter.');
    expect(validatePasswordPolicy('StrongPass123')).toEqual([]);
  });

  it('hashes and verifies passwords', async () => {
    const hash = await hashPassword('StrongPass123');
    expect(hash).not.toBe('StrongPass123');
    await expect(verifyPassword('StrongPass123', hash)).resolves.toBe(true);
    await expect(verifyPassword('WrongPass123', hash)).resolves.toBe(false);
  });

  it('creates hashed reset tokens', () => {
    const reset = createPasswordResetToken();
    expect(reset.token).not.toEqual(reset.tokenHash);
    expect(hashPasswordResetToken(reset.token)).toEqual(reset.tokenHash);
  });
});

describe('session helpers', () => {
  it('signs and verifies session tokens', () => {
    const token = createSessionToken({ userId: 'user_1', email: 'user@example.com', role: 'USER' }, 1000);
    expect(verifySessionToken(token, 2000)).toMatchObject({ userId: 'user_1', email: 'user@example.com', role: 'USER' });
  });

  it('rejects tampered session tokens', () => {
    const token = createSessionToken({ userId: 'user_1', email: 'user@example.com', role: 'ADMIN' }, 1000);
    const tampered = `${token.slice(0, -1)}${token.endsWith('a') ? 'b' : 'a'}`;
    expect(verifySessionToken(tampered, 2000)).toBeNull();
  });

  it('rejects expired session tokens', () => {
    const token = createSessionToken({ userId: 'user_1', email: 'user@example.com', role: 'USER' }, 1000);
    expect(verifySessionToken(token, 1000 + 8 * 24 * 60 * 60 * 1000)).toBeNull();
  });
});
