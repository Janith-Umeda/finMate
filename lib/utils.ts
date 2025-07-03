export function checkEmailValidity(email: string): string | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || email === '') {
        return 'Email cannot be empty.'
    }

    if (!emailRegex.test(email)) {
        return 'Invalid email address!';
    }

    return null;
}

export function checkPSWValidity(psw: string): string | null {
    if (!psw) {
        return "Password cannot be empty.";
    }
    if (psw.length < 8) {
        return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(psw)) {
        return "Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(psw)) {
        return "Password must contain at least one lowercase letter.";
    }
    if (!/[0-9]/.test(psw)) {
        return "Password must contain at least one digit.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(psw)) {
        return "Password must contain at least one special character.";
    }
    return null;
}

export function getHashedPassword(password: string): string {
    if (typeof window !== 'undefined' && window.btoa) {
        return window.btoa(password);
    } else if (typeof btoa !== 'undefined') {
        return btoa(password);
    } else {
        throw new Error('Base64 encoding not supported in this environment.');
    }
}

export function checkPasswordHash(password: string, hashed: string): boolean {
    return getHashedPassword(password) === hashed;
}

export function abbreviateNumber(num: number) {
    if (num == null) {
        return 0;
    }

    // 1,000 <= num < 1,000,000
    if (num >= 1000 && num < 1000000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    // 1,000,000 <= num < 1,000,000,000
    else if (num >= 1000000 && num < 1000000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    // num >= 1,000,000,000
    else if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    }

    else {
        return num;
    }
}