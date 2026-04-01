// Auth functionality for ChinesePod101

// Password strength checker
function checkPasswordStrength(password) {
    const bar = document.getElementById('strengthBar');
    const hint = document.getElementById('strengthHint');
    
    if (!bar || !hint) return;
    
    let strength = 0;
    let feedback = '';
    
    // Check length
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Check for numbers
    if (/\d/.test(password)) strength++;
    
    // Check for lowercase
    if (/[a-z]/.test(password)) strength++;
    
    // Check for uppercase
    if (/[A-Z]/.test(password)) strength++;
    
    // Check for special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    // Update UI
    bar.className = 'password-strength-bar';
    
    if (password.length === 0) {
        bar.style.width = '0';
        hint.textContent = 'Use 8+ characters with letters, numbers & symbols';
        hint.style.color = '#888';
    } else if (strength < 3) {
        bar.classList.add('weak');
        hint.textContent = 'Weak - Add more characters, numbers or symbols';
        hint.style.color = '#ff4444';
    } else if (strength < 5) {
        bar.classList.add('medium');
        hint.textContent = 'Medium - Getting better!';
        hint.style.color = '#ffaa00';
    } else {
        bar.classList.add('strong');
        hint.textContent = 'Strong - Great password!';
        hint.style.color = '#00cc66';
    }
}

// Form submission handlers
document.addEventListener('DOMContentLoaded', function() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.querySelector('input[name="remember"]').checked;
            
            // Simulate login (in real app, this would be an API call)
            console.log('Login attempt:', { email, remember });
            
            // Show success message
            showSuccess('Welcome back!', 'Redirecting to your dashboard...');
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        });
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate passwords match
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // Simulate signup (in real app, this would be an API call)
            console.log('Signup attempt:', { name, email });
            
            // Show success message
            showSuccess('Account created!', 'Welcome to ChinesePod101!');
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        });
    }
});

// Social login handler
function socialLogin(provider) {
    console.log('Social login with:', provider);
    
    // In a real app, this would redirect to OAuth flow
    alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login would open in a popup.\n\nThis is a demo - social login requires backend setup.`);
}

// Forgot password handler
function showForgotPassword() {
    const email = prompt('Enter your email address:');
    if (email) {
        alert(`Password reset link sent to: ${email}\n\nThis is a demo - email functionality requires backend setup.`);
    }
}

// Show success message
function showSuccess(title, message) {
    const container = document.querySelector('.auth-main');
    
    container.innerHTML = `
        <div class="auth-success">
            <div class="success-icon">✅</div>
            <h2>${title}</h2>
            <p>${message}</p>
        </div>
    `;
}

// Check if user is logged in (demo)
function checkAuth() {
    const user = localStorage.getItem('chinesepod101_user');
    return user ? JSON.parse(user) : null;
}

// Login function (for use from other pages)
function loginUser(userData) {
    localStorage.setItem('chinesepod101_user', JSON.stringify(userData));
}

// Logout function
function logoutUser() {
    localStorage.removeItem('chinesepod101_user');
    window.location.href = 'index.html';
}

// Update UI based on auth state
function updateAuthUI() {
    const user = checkAuth();
    const loginBtn = document.querySelector('.btn-login');
    const signupBtn = document.querySelector('.btn-signup');
    
    if (user && loginBtn && signupBtn) {
        loginBtn.textContent = user.name || 'Account';
        loginBtn.href = '#';
        loginBtn.onclick = () => {
            if (confirm('Do you want to log out?')) {
                logoutUser();
            }
        };
        signupBtn.style.display = 'none';
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', updateAuthUI);
