# Airbnb Cleaning Service Website

## Technology Stack

### Frontend Technologies
1. **HTML5**
   - Used for structuring the website content
   - Provides semantic elements for better accessibility
   - Forms for user input (login, registration, booking)

2. **CSS3**
   - Styling and layout of the website
   - Bootstrap 5.3.2 framework for responsive design
   - Custom styles for specific components
   - Bootstrap Icons for visual elements

3. **JavaScript (ES6+)**
   - Client-side interactivity
   - Asynchronous operations using async/await
   - DOM manipulation
   - Event handling
   - Local Storage for user session management

### Backend Technologies
1. **Node.js**
   - JavaScript runtime environment
   - Handles server-side operations
   - Manages HTTP requests and responses

2. **Express.js**
   - Web application framework for Node.js
   - Handles routing and middleware
   - Manages API endpoints
   - Provides RESTful API structure

3. **CORS (Cross-Origin Resource Sharing)**
   - Enables secure cross-origin requests
   - Allows frontend to communicate with backend
   - Handles security policies

### Development Tools
1. **Git**
   - Version control system
   - Tracks code changes
   - Enables collaboration

2. **GitHub**
   - Code hosting platform
   - Remote repository storage
   - Project management

### Project Structure
```
airbnb-cleaning-service/
├── frontend/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # Custom styles
│   └── app.js          # Frontend JavaScript
├── backend/
│   └── server.js       # Backend server code
└── package.json        # Project dependencies
```

## How It Works

### Frontend-Backend Communication
1. **API Endpoints**
   - `/api/register` - User registration
   - `/api/login` - User authentication
   - `/api/bookings` - Booking management
   - `/api/my-bookings` - User's bookings
   - `/api/debug/users` - User management (debug)

2. **Data Flow**
   - Frontend makes HTTP requests to backend
   - Backend processes requests and sends responses
   - Data is exchanged in JSON format

### Authentication System
1. **Token-based Authentication**
   - JWT-like tokens for session management
   - Stored in browser's Local Storage
   - Sent with each API request

2. **User Roles**
   - Owner: Can manage all bookings
   - Customer: Can manage their own bookings

### Booking System
1. **Booking States**
   - Pending: New booking awaiting approval
   - Accepted: Owner approved the booking
   - Declined: Owner rejected the booking
   - Rescheduled: Customer changed the date

2. **Date Validation**
   - Prevents booking past dates
   - Validates rescheduling dates
   - Uses JavaScript Date object

### Data Storage
1. **In-Memory Storage**
   - Users array for user data
   - Bookings array for booking data
   - Note: In production, would use a database

## Security Features
1. **Input Validation**
   - Server-side validation
   - Client-side validation
   - Date validation

2. **Access Control**
   - Role-based access
   - Token verification
   - Protected routes

## How to Run the Project

### Starting the Server
1. Open Command Prompt
2. Navigate to backend directory:
   ```cmd
   cd C:\airbnb-cleaning-service\backend
   ```
3. Start the server:
   ```cmd
   node server.js
   ```

### Opening the Website
1. Navigate to frontend directory:
   ```cmd
   cd C:\airbnb-cleaning-service\frontend
   ```
2. Open `index.html` in your browser

### Default Login Credentials
- Email: owner@example.com
- Password: owner123

## Common Errors and Solutions

### Server Connection Issues
1. **"Unable to connect to server"**
   - Check if server is running
   - Verify port 5000 is available
   - Check firewall settings

2. **"Address already in use"**
   - Stop existing Node.js processes
   - Restart the server

### Browser Issues
1. **CORS Errors**
   - Server must be running
   - Check browser console for details

2. **Cache Issues**
   - Clear browser cache
   - Hard refresh (Ctrl + F5)

## Future Improvements
1. **Database Integration**
   - Replace in-memory storage
   - Add data persistence
   - Implement proper data models

2. **Enhanced Security**
   - Implement proper JWT
   - Add password hashing
   - Add rate limiting

3. **Additional Features**
   - Email notifications
   - Payment integration
   - Calendar integration

## How to Stop the Server

### Method 1 (Recommended)
- Press `Ctrl + C` in the PowerShell window where the server is running
- Type `Y` and press Enter if prompted

### Method 2 (Force Stop)
If Method 1 doesn't work:
```powershell
taskkill /F /IM node.exe
```

## Testing the Website
1. Start the server (follow steps above)
2. Open the website in your browser
3. Try logging in with the default owner account
4. If you can't log in:
   - Make sure the server is running (check PowerShell window)
   - Try stopping and restarting the server

## Need Help?
If you encounter any issues:
1. Make sure the server is running (you should see "Server running on port 5000")
2. Check that you're in the correct directory
3. Try stopping and restarting the server
4. Make sure you haven't closed the PowerShell window running the server 