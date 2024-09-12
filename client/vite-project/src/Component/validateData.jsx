export const validateData = (email, password) => {
    const isEmailValid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    const isPasswordValid =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
            password
        );

    if (!isEmailValid) return "Email is not valid";
    if (!isPasswordValid)
        return "Minimum password length can be 8 characters, at least one letter, one number and one special character";

    return null;
};