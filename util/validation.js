function signupIsValid(userData) {
    const data = {...userData}
    return (
        data.email &&
        data.confirmEmail &&
        data.password &&
        data.name &&
        data.street &&
        data.postalCode &&
        data.city &&
        data.email.includes('@') &&
        data.email === data.confirmEmail
    );
}

function loginIsValid(email, password) {
    return (
        email &&
        password
    );
}

module.exports = {
    signupIsValid: signupIsValid,
    loginIsValid: loginIsValid
}