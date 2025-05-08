// Import the tools we need to build our website
const express = require('express');
const cors = require('cors');
const app = express();

// Set up basic website features
app.use(cors());  // Allow our website to talk to other websites
app.use(express.json());  // Allow our website to understand JSON data

// Keep track of what's happening on our website
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// How much each cleaning service costs
const SERVICE_PRICES = {
    'Standard Cleaning': 500,  // Basic cleaning service
    'Deep Cleaning': 800,      // More thorough cleaning
    'Premium Cleaning': 1200   // Complete cleaning package
};

// Where we store our data (in real life, we would use a database)
let users = [];      // Store all user accounts
let bookings = [];   // Store all cleaning bookings

// Check if a date is valid (can't book dates in the past)
function isValidDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
}

// Check if a user is logged in
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Please log in first' });
    }
    const user = users.find(u => u.token === token);
    if (!user) {
        return res.status(401).json({ message: 'Your login session has expired' });
    }
    req.user = user;
    next();
};

// Show all users (only for testing)
app.get('/api/debug/users', (req, res) => {
    // Don't show passwords for security
    const safeUsers = users.map(user => ({
        id: user.id,
        email: user.email,
        isOwner: user.isOwner
    }));
    res.json(safeUsers);
});

// Let new users create an account
app.post('/api/register', (req, res) => {
    console.log('New user trying to register:', req.body.email);
    const { email, password } = req.body;
    
    // Check if email is already used
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'This email is already registered' });
    }
    
    // Create new user account
    const user = {
        id: users.length + 1,
        email,
        password, // In a real website, we would encrypt this
        token: Math.random().toString(36).substring(7),
        isOwner: email === 'owner@example.com'  // Special account for the owner
    };
    
    users.push(user);
    console.log('New account created for:', email);
    res.json({ token: user.token });
});

// Let users log in
app.post('/api/login', (req, res) => {
    console.log('User trying to log in:', req.body.email);
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        console.log('Login failed for:', email);
        return res.status(401).json({ message: 'Wrong email or password' });
    }
    
    console.log('Login successful for:', email);
    res.json({ 
        token: user.token,
        isOwner: user.isOwner 
    });
});

// Show cleaning service prices
app.get('/api/services', (req, res) => {
    res.json(SERVICE_PRICES);
});

// Create a new cleaning booking
app.post('/api/bookings', authenticateUser, (req, res) => {
    const { date, service } = req.body;
    
    // Make sure the booking date is in the future
    if (!isValidDate(date)) {
        return res.status(400).json({ message: 'Please choose a future date' });
    }
    
    // Check if the service exists and get its price
    if (!SERVICE_PRICES[service]) {
        return res.status(400).json({ message: 'Please select a valid cleaning service' });
    }
    
    // Create the booking
    const booking = {
        id: bookings.length + 1,
        userId: req.user.id,
        ...req.body,
        price: SERVICE_PRICES[service],
        status: 'pending',
        createdAt: new Date()
    };
    
    bookings.push(booking);
    res.json(booking);
});

// Show all bookings (only for the owner)
app.get('/api/bookings', authenticateUser, (req, res) => {
    if (!req.user.isOwner) {
        return res.status(403).json({ message: 'Only the owner can see all bookings' });
    }
    res.json(bookings);
});

// Show a user's own bookings
app.get('/api/my-bookings', authenticateUser, (req, res) => {
    const userBookings = bookings.filter(b => b.userId === req.user.id);
    res.json(userBookings);
});

// Update booking status (accept/decline)
app.put('/api/bookings/:id/status', authenticateUser, (req, res) => {
    if (!req.user.isOwner) {
        return res.status(403).json({ message: 'Only the owner can update booking status' });
    }
    
    const { id } = req.params;
    const { status } = req.body;
    
    const booking = bookings.find(b => b.id === parseInt(id));
    if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if the status is valid
    if (!['accepted', 'declined', 'rescheduled_accepted', 'rescheduled_declined'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Handle rescheduled bookings differently
    if (booking.status === 'rescheduled') {
        if (status === 'accepted') {
            booking.status = 'rescheduled_accepted';
        } else if (status === 'declined') {
            booking.status = 'rescheduled_declined';
        }
    } else {
        booking.status = status;
    }
    
    res.json(booking);
});

// Let users change their booking date
app.put('/api/bookings/:id/reschedule', authenticateUser, (req, res) => {
    const { id } = req.params;
    const { date } = req.body;
    
    // Make sure the new date is in the future
    if (!isValidDate(date)) {
        return res.status(400).json({ message: 'Please choose a future date' });
    }
    
    const booking = bookings.find(b => b.id === parseInt(id));
    if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Make sure users can only change their own bookings
    if (booking.userId !== req.user.id) {
        return res.status(403).json({ message: 'You can only change your own bookings' });
    }
    
    booking.date = date;
    booking.status = 'rescheduled';
    res.json(booking);
});

// Start the website
const PORT = 5000;
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`Website started at ${new Date().toISOString()}`);
    console.log(`Visit http://localhost:${PORT} to see the website`);
    console.log('='.repeat(50));
    
    // Create the owner account if it doesn't exist
    if (!users.find(u => u.email === 'owner@example.com')) {
        users.push({
            id: 1,
            email: 'owner@example.com',
            password: 'owner123', // In a real website, this would be encrypted
            token: 'owner-token',
            isOwner: true
        });
        console.log('Owner account created');
    }
}); 