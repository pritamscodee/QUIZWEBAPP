export const isValidEmail = (email) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    if (!password || password.length < 6) {
        return {
            isValid: false,
            message: 'Password must be at least 6 characters long'
        };
    }
    
    const hasNumber = /\d/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    
    return {
        isValid: true,
        strength: hasNumber && hasUpperCase ? 'strong' : 'weak',
        message: 'Password is valid'
    };
};

export const validateUsername = (username) => {
    if (!username || username.length < 3) {
        return {
            isValid: false,
            message: 'Username must be at least 3 characters long'
        };
    }
    
    if (username.length > 30) {
        return {
            isValid: false,
            message: 'Username cannot exceed 30 characters'
        };
    }
    
    return {
        isValid: true,
        message: 'Username is valid'
    };
};