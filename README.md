# Airbnb Cleaning Service Website

## How to Run the Website

### Starting the Server
1. Open PowerShell
2. Navigate to the backend directory:
   ```powershell
   cd C:\airbnb-cleaning-service\backend
   ```
3. Start the server:
   ```powershell
   node server.js
   ```
   You should see: "Server running on port 5000"

   **Note**: Keep this PowerShell window open while using the website!

### Opening the Website
1. Navigate to `C:\airbnb-cleaning-service\frontend`
2. Double-click `index.html` to open in your browser
3. The website should now be running

### Default Login Credentials
- Email: owner@example.com
- Password: owner123

## Common Errors and Solutions

### Error: "The token '&&' is not a valid statement separator"
If you see this error:
```
The token '&&' is not a valid statement separator in this version
```
Solution: Use semicolon (;) instead:
```powershell
cd backend; node server.js
```

### Error: "address already in use :::5000"
If you see this error:
```
Error: listen EADDRINUSE: address already in use :::5000
```
This means the server is already running. To fix:

1. Stop the existing server:
   ```powershell
   taskkill /F /IM node.exe
   ```
2. Start the server again:
   ```powershell
   node server.js
   ```

### Error: "Cannot find module 'server.js'"
If you see this error:
```
Error: Cannot find module 'C:\airbnb-cleaning-service\server.js'
```
This means you're in the wrong directory. Make sure to:
1. Change to the backend directory first:
   ```powershell
   cd C:\airbnb-cleaning-service\backend
   ```
2. Then start the server:
   ```powershell
   node server.js
   ```

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