const MESSAGES: Record<string, string> = {
    INVALID_CREDENTIALS: 'That email/phone and password do not match.',
    USER_DISABLED: 'This account has been disabled. Contact support.',
    EMAIL_ALREADY_REGISTERED: 'An account with this email already exists. Try signing in.',
    PHONE_ALREADY_REGISTERED: 'An account with this phone number already exists. Try signing in.',
    WEAK_PASSWORD: 'Use at least 10 characters.',
    TOKEN_INVALID: 'This link is invalid or has expired.',
    VALIDATION_FAILED: 'Check the highlighted fields.',
    HTTP_ERROR: 'We could not reach MtokaaHero. Check your connection and try again.',
};

export function authErrorMessage(code: string): string {
    return MESSAGES[code] ?? 'Something went wrong. Please try again.';
}

export function passwordStrength(pw: string): 0 | 1 | 2 | 3 | 4 {
    if (!pw) return 0;
    if (pw.length < 10) return 1;
    const variety = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((re) => re.test(pw)).length;
    if (variety >= 4) return 4;
    if (variety >= 3) return 3;
    return 2;
}
