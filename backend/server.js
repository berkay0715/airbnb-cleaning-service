// Import required packages
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// In-memory storage (for demonstration - would use a database in production)
let users = [];
let bookings = [];

// Authentication middleware
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    // Simple token validation (would use JWT in production)
    const user = users.find(u => u.token === token);
    if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
};

// Routes

// Debug route to see all users (only for development)
app.get('/api/debug/users', (req, res) => {
    // Send a safe version of users (without passwords)
    const safeUsers = users.map(user => ({
        id: user.id,
        email: user.email,
        isOwner: user.isOwner
    }));
    res.json(safeUsers);
});

// Register new user
app.post('/api/register', (req, res) => {
    console.log('Registration attempt:', req.body.email);
    const { email, password } = req.body;
    
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = {
        id: users.length + 1,
        email,
        password, // In production, would hash the password
        token: Math.random().toString(36).substring(7),
        isOwner: email === 'owner@example.com'
    };
    
    users.push(user);
    console.log('User registered successfully:', email);
    res.json({ token: user.token });
});

// Login
app.post('/api/login', (req, res) => {
    console.log('Login attempt:', req.body.email);
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        console.log('Login failed for:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log('Login successful for:', email);
    res.json({ 
        token: user.token,
        isOwner: user.isOwner 
    });
});

// Create a booking
app.post('/api/bookings', authenticateUser, (req, res) => {
    const booking = {
        id: bookings.length + 1,
        userId: req.user.id,
        ...req.body,
        createdAt: new Date()
    };
    
    bookings.push(booking);
    res.json(booking);
});

// Get all bookings (owner only)
app.get('/api/bookings', authenticateUser, (req, res) => {
    if (!req.user.isOwner) {
        return res.status(403).json({ message: 'Access denied' });
    }
    res.json(bookings);
});

// Get user's bookings
app.get('/api/my-bookings', authenticateUser, (req, res) => {
    const userBookings = bookings.filter(b => b.userId === req.user.id);
    res.json(userBookings);
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`Server started at ${new Date().toISOString()}`);
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('='.repeat(50));
    
    // Create default owner account
    if (!users.find(u => u.email === 'owner@example.com')) {
        users.push({
            id: 1,
            email: 'owner@example.com',
            password: 'owner123', // Would be hashed in production
            token: 'owner-token',
            isOwner: true
        });
        console.log('Default owner account created');
    }
}); 