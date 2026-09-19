const form = document.getElementById("registrationForm");

const name = document.getElementById("name");
const email = document.getElementById("email");
const mobile = document.getElementById("mobile");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const terms = document.getElementById("terms");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const mobileError = document.getElementById("mobileError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");
const termsError = document.getElementById("termsError");
const successMessage = document.getElementById("successMessage");

function validateName() {
    const value = name.value.trim();

    if (value === "") {
        nameError.textContent = "Name cannot be empty.";
        return false;
    }

    if (value.length < 3) {
        nameError.textContent = "Name must contain at least 3 characters.";
        return false;
    }

    nameError.textContent = "";
    return true;
}

function validateEmail() {
    const value = email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value === "") {
        emailError.textContent = "Email cannot be empty.";
        return false;
    }

    if (!emailPattern.test(value)) {
        emailError.textContent = "Invalid email address.";
        return false;
    }

    emailError.textContent = "";
    return true;
}

function validateMobile() {
    const value = mobile.value.trim();
    const mobilePattern = /^[0-9]{10}$/;

    if (value === "") {
        mobileError.textContent = "Mobile number cannot be empty.";
        return false;
    }

    if (!mobilePattern.test(value)) {
        mobileError.textContent = "Enter a valid 10 digit mobile number.";
        return false;
    }

    mobileError.textContent = "";
    return true;
}

function validatePassword() {
    const value = password.value;

    if (value.length < 8) {
        passwordError.textContent = "Password must contain at least 8 characters.";
        return false;
    }

    if (!/[0-9]/.test(value)) {
        passwordError.textContent = "Password must contain at least one number.";
        return false;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        passwordError.textContent = "Password must contain at least one special character.";
        return false;
    }

    passwordError.textContent = "";
    return true;
}

function validateConfirmPassword() {
    if (confirmPassword.value === "") {
        confirmPasswordError.textContent = "Please confirm your password.";
        return false;
    }

    if (confirmPassword.value !== password.value) {
        confirmPasswordError.textContent = "Passwords do not match.";
        return false;
    }

    confirmPasswordError.textContent = "";
    return true;
}

function validateTerms() {
    if (!terms.checked) {
        termsError.textContent = "Please accept the Terms & Conditions.";
        return false;
    }

    termsError.textContent = "";
    return true;
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameValid = validateName();
    const emailValid = validateEmail();
    const mobileValid = validateMobile();
    const passwordValid = validatePassword();
    const confirmPasswordValid = validateConfirmPassword();
    const termsValid = validateTerms();

    if (
        nameValid &&
        emailValid &&
        mobileValid &&
        passwordValid &&
        confirmPasswordValid &&
        termsValid
    ) {
        successMessage.textContent = "Registration successful!";
        form.reset();
    } else {
        successMessage.textContent = "";
    }
});

name.addEventListener("input", validateName);
email.addEventListener("input", validateEmail);
mobile.addEventListener("input", validateMobile);
password.addEventListener("input", function () {
    validatePassword();

    if (confirmPassword.value !== "") {
        validateConfirmPassword();
    }
});

confirmPassword.addEventListener("input", validateConfirmPassword);
terms.addEventListener("change", validateTerms);

document.getElementById("showPassword").addEventListener("click", function () {
    if (password.type === "password") {
        password.type = "text";
        this.textContent = "🙈";
    } else {
        password.type = "password";
        this.textContent = "👁";
    }
});

document.getElementById("showConfirmPassword").addEventListener("click", function () {
    if (confirmPassword.type === "password") {
        confirmPassword.type = "text";
        this.textContent = "🙈";
    } else {
        confirmPassword.type = "password";
        this.textContent = "👁";
    }
});

form.addEventListener("reset", function () {
    successMessage.textContent = "";

    nameError.textContent = "";
    emailError.textContent = "";
    mobileError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";
    termsError.textContent = "";
});