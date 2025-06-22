export function checkEmailValidity(email: string): string | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if(!email || email === ''){
        return 'Email cannot be empty.'
    }

    if(!emailRegex.test(email)){
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