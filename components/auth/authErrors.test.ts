import { describe, expect, it } from 'vitest';
import { authErrorMessage, passwordStrength } from './authErrors';

describe('authErrorMessage', () => {
    it('maps API codes to friendly copy', () => {
        expect(authErrorMessage('INVALID_CREDENTIALS')).toBe('That email/phone and password do not match.');
        expect(authErrorMessage('EMAIL_ALREADY_REGISTERED')).toBe('An account with this email already exists. Try signing in.');
        expect(authErrorMessage('SOMETHING_NEW')).toBe('Something went wrong. Please try again.');
        expect(authErrorMessage('RATE_LIMITED')).toBe('Too many attempts. Please wait a minute and try again.');
        expect(authErrorMessage('SIGN_IN_FAILED')).toBe('We could not reach MtokaaHero. Check your connection and try again.');
    });
});

describe('passwordStrength', () => {
    it('scores length and variety', () => {
        expect(passwordStrength('')).toBe(0);
        expect(passwordStrength('short')).toBe(1);
        expect(passwordStrength('longenough')).toBe(2);
        expect(passwordStrength('LongEnough12')).toBe(3);
        expect(passwordStrength('Long-Enough-12!')).toBe(4);
    });
});
