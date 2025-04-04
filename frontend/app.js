// API URL
const API_URL = 'http://localhost:5000/api';

// Store user token
let userToken = localStorage.getItem('token');
let isOwner = localStorage.getItem('isOwner') === 'true';

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    showSection('home');
});

// Show/hide sections based on authentication
function updateNavigation() {
    const authNav = document.getElementById('authNav');
    authNav.innerHTML = userToken
        ? `
            ${isOwner 
                ? '<li class="nav-item"><a class="nav-link" href="#" onclick="showSection(\'dashboard\')">Dashboard</a></li>'
                : ''
            }
            <li class="nav-item"><a class="nav-link" href="#" onclick="logout()">Logout</a></li>
          `
        : `
            <li class="nav-item"><a class="nav-link" href="#" onclick="showSection('login')">Login</a></li>
            <li class="nav-item"><a class="nav-link" href="#" onclick="showSection('register')">Register</a></li>
          `;
}

// Show selected section and hide others
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
    }
    
    // Reset forms when switching sections
    document.querySelectorAll('form').forEach(form => form.reset());
    
    // Load bookings if showing dashboard
    if (sectionId === 'dashboard' && isOwner) {
        loadBookings();
    }
}

// Show error message in form
function showFormError(formId, message) {
    const form = document.getElementById(formId);
    let errorDiv = form.querySelector('.alert');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger mt-3';
        form.insertBefore(errorDiv, form.firstChild);
    }
    errorDiv.textContent = message;
}

// Clear form error
function clearFormError(formId) {
    const form = document.getElementById(formId);
    const errorDiv = form.querySelector('.alert');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Register new user
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFormError('registerForm');
    
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    if (!email || !password) {
        showFormError('registerForm', 'Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Registration successful! Please login.');
            showSection('login');
        } else {
            showFormError('registerForm', data.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showFormError('registerForm', 'Unable to connect to the server. Please try again later.');
    }
});

// Login user
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFormError('loginForm');
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showFormError('loginForm', 'Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            userToken = data.token;
            isOwner = data.isOwner;
            localStorage.setItem('token', userToken);
            localStorage.setItem('isOwner', isOwner);
            updateNavigation();
            showSection(isOwner ? 'dashboard' : 'home');
        } else {
            showFormError('loginForm', data.message || 'Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Login error:', error);
        showFormError('loginForm', 'Unable to connect to the server. Please try again later.');
    }
});

// Logout user
function logout() {
    userToken = null;
    isOwner = false;
    localStorage.removeItem('token');
    localStorage.removeItem('isOwner');
    updateNavigation();
    showSection('home');
}

// Submit booking
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!userToken) {
        alert('Please login first');
        showSection('login');
        return;
    }
    
    const booking = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        service: document.getElementById('service').value,
        date: document.getElementById('date').value
    };
    
    try {
        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userToken
            },
            body: JSON.stringify(booking)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Booking submitted successfully!');
            e.target.reset();
            showSection('home');
        } else {
            alert(data.message || 'Booking failed');
        }
    } catch (error) {
        alert('Error submitting booking');
        console.error(error);
    }
});

// Load bookings for owner dashboard
async function loadBookings() {
    if (!isOwner || !userToken) return;
    
    try {
        const response = await fetch(`${API_URL}/bookings`, {
            headers: {
                'Authorization': userToken
            }
        });
        
        const bookings = await response.json();
        
        if (response.ok) {
            const bookingsList = document.getElementById('bookingsList');
            bookingsList.innerHTML = bookings.length
                ? `
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Service</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${bookings.map(booking => `
                                <tr>
                                    <td>${new Date(booking.date).toLocaleString()}</td>
                                    <td>${booking.name}</td>
                                    <td>${booking.email}</td>
                                    <td>${booking.phone}</td>
                                    <td>${booking.address}</td>
                                    <td>${booking.service}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `
                : '<p>No bookings found</p>';
        } else {
            alert('Failed to load bookings');
        }
    } catch (error) {
        alert('Error loading bookings');
        console.error(error);
    }
}

// Add some basic styles
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .content-section {
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .card {
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .table {
            background-color: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
    </style>
`); 