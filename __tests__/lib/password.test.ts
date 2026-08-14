import { hashPassword, verifyPassword } from '@/lib/password';

describe('lib/password.ts', () => {
  const testPassword = 'testPassword123';

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const hash = await hashPassword(testPassword);
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).not.toBe(testPassword);
    });
  });

  describe('verifyPassword', () => {
    it('should verify a correct password', async () => {
      const hash = await hashPassword(testPassword);
      const isValid = await verifyPassword(testPassword, hash);
      expect(isValid).toBe(true);
    });

    it('should not verify an incorrect password', async () => {
      const hash = await hashPassword(testPassword);
      const isValid = await verifyPassword('wrongPassword', hash);
      expect(isValid).toBe(false);
    });
  });
});