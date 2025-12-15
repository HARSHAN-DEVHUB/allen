# ProjectHub - Student Project Showcase Platform

A modern, **multi-page** responsive web application for students to showcase their projects, rate, and discover amazing work from peers.

## 🚀 Features

- **Real-time Authentication**: Email and password validation with persistent sessions
- **Multi-page Architecture**: Separate pages for better organization and navigation
- **Project Showcase**: Browse and search through student projects
- **Dashboard**: Track views, ratings, and bookmarks
- **Project Upload**: Share your own projects with the community
- **Search & Filter**: Find projects by category and keywords
- **Session Persistence**: Stay logged in across page navigation
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

## 📁 Project Structure

```text
college project showcase project/
├── ProjectHub.html     # Landing/Home page
├── browse.html        # Browse all projects
├── dashboard.html     # User statistics dashboard
├── mywork.html        # Manage your projects
├── account.html       # Profile settings
├── styles.css         # All styling
├── app.js            # Application logic & auth
├── data.js           # Project database
└── README.md         # This file
```

## 🎯 How to Run

### Method 1: Using Live Server (Recommended - Already Installed!)

1. **Open the project folder in VS Code**
2. **Right-click** on `ProjectHub.html`
3. **Select "Open with Live Server"**
4. Your browser will automatically open at `http://127.0.0.1:5500/ProjectHub.html`

#### Alternative

- Click on the **"Go Live"** button in the bottom right of VS Code status bar

### Method 2: Direct Browser Open

1. **Navigate** to the project folder
2. **Double-click** `ProjectHub.html`
3. The file will open in your default browser
4. Navigate between pages using the menu

## 🌐 Pages Overview

### 1. **ProjectHub.html** (Landing Page)

- Hero section with call-to-action
- Login/Register modals
- Quick navigation to all sections

### 2. **browse.html** (Browse Projects)

- View all projects
- Search functionality
- Category filtering
- Project cards with details

### 3. **dashboard.html** (Statistics)

- Total project views
- Number of published projects
- Average rating
- Total bookmarks
- **Requires login**

### 4. **mywork.html** (My Projects)

- View your uploaded projects
- Upload new projects
- Manage existing projects
- **Requires login**

### 5. **account.html** (Profile Settings)

- Update your name
- Edit bio and interests
- Manage skills
- Update study field
- **Requires login**

## 🔐 Authentication System

### Registration

- **Name**: Full name required
- **Email**: Valid email format required
- **Password**: Minimum 6 characters
- **Field**: Select your study field
- **Storage**: Data stored in browser localStorage

### Login

- Uses **real-time validation**
- Credentials verified against localStorage
- Email format checking
- **Session persistence** using sessionStorage
- Invalid credential alerts

### Session Management

- **Persistent login** across pages
- **Auto-redirect** for protected pages
- **Session cleared** on logout
- Secure logout confirmation

## 💡 How to Use

### 1. **Create an Account**

- Open `ProjectHub.html`
- Click "Join Us" or "Get Started Free"
- Fill in your details
- Click "Create Account"
- Automatically redirected to Browse page

### 2. **Login**

- Click "Sign In" from any page
- Enter your registered email and password
- Click "Sign In"
- Session persists across pages

### 3. **Browse Projects**

- Navigate to "Browse" from menu
- Use search bar to find specific projects
- Filter by category (Web, Mobile, AI, Data, Game, Desktop)
- Click on projects to view details

### 4. **Upload Your Project**

- Go to "My Work" (login required)
- Click "+ New Project"
- Fill in project details:
  - Title
  - Description
  - Category
  - Technologies used
  - GitHub URL
  - Live Demo URL (optional)
- Click "Publish Project"

### 5. **View Dashboard**

- Navigate to "Dashboard" (login required)
- See your statistics:
  - Total views
  - Published projects count
  - Average rating
  - Total bookmarks

### 6. **Update Profile**

- Go to "Account" (login required)
- Update your information
- Click "Save Changes"
- Profile updates saved to localStorage

## 🛠️ Technologies Used

- **HTML5**: Semantic markup, multi-page structure
- **CSS3**: Modern styling with CSS variables, Grid, Flexbox
- **JavaScript (ES6+)**: Application logic, session management
- **LocalStorage API**: Persistent user data
- **SessionStorage API**: Login session management

## ✨ New Multi-Page Features

### Navigation

- **Active page highlighting** in navigation
- **Seamless page transitions**
- **Session persistence** across pages
- **Protected routes** for authenticated content

### Security

- **Auth checking** on page load
- **Auto-redirect** for unauthorized access
- **Session validation** before loading content
- **Secure logout** with confirmation

### User Experience

- **No page reload** authentication
- **Persistent user state** across navigation
- **Automatic form clearing** after submission
- **Real-time validation** feedback

## 🎨 Customization

### Change Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --color-primary: #2563EB;
    --color-secondary: #7C3AED;
    /* Modify other colors as needed */
}
```

### Add More Categories

Edit the category options in each HTML file's dropdown menus

### Modify Sample Projects

Edit the `projectDatabase` array in `data.js`

## 🐛 Troubleshooting

### Issue: Projects not showing

**Solution**:

- Make sure `data.js` is loaded before `app.js` in HTML
- Check browser console (F12) for errors

### Issue: Login not working

**Solution**:

- Check browser console (F12) for errors
- Ensure localStorage is enabled in your browser
- Clear browser cache and try again

### Issue: Session not persisting

**Solution**:

- Ensure sessionStorage is enabled
- Check if popup/cookie blocking is enabled
- Try in incognito/private browsing mode

### Issue: Redirected to home page

**Solution**:

- This is normal for protected pages when not logged in
- Sign in first, then access Dashboard/My Work/Account

### Issue: Styles not loading

**Solution**:

- Verify `styles.css` is in the same folder as HTML files
- Check the file path in the HTML `<link>` tags
- Clear browser cache

## 📝 Test Flow

1. **Start at Landing Page**: `ProjectHub.html`
2. **Create Account**: Register with test credentials
3. **Browse Projects**: Automatically redirected to `browse.html`
4. **View Dashboard**: Navigate to see your stats
5. **Upload Project**: Go to My Work and add a project
6. **Update Profile**: Edit your information in Account
7. **Logout**: Sign out and return to landing page

## 🔒 Security Notes

⚠️ **This is a demonstration project**

- Passwords stored in plain text in localStorage
- Sessions use sessionStorage (cleared on tab close)
- Not suitable for production use
- For learning purposes only
- In production, use proper backend with:
  - Password hashing (bcrypt)
  - JWT tokens
  - HTTPS
  - Server-side validation

## 📱 Browser Compatibility

Tested and working on:

- ✅ Google Chrome (Recommended)
- ✅ Microsoft Edge
- ✅ Mozilla Firefox
- ✅ Safari
- ✅ Opera

## 🎓 Learning Resources

This project demonstrates:

- **Multi-page application** architecture
- **Session management** with sessionStorage
- **Protected routes** and authentication
- **DOM manipulation** across pages
- **Event handling** and form validation
- **Local storage** for persistent data
- **Responsive design** principles
- **CSS Grid & Flexbox** layouts
- **Modern JavaScript** (ES6+)

## 🆕 What's New in Multi-Page Version

### Before (Single Page)

- ❌ All content in one file
- ❌ JavaScript page switching
- ❌ No URL changes
- ❌ Harder to bookmark specific sections

### Now (Multi-Page)

- ✅ Separate HTML files for each section
- ✅ Real page navigation
- ✅ Unique URLs for each page
- ✅ Bookmarkable pages
- ✅ Better SEO potential
- ✅ Cleaner code organization
- ✅ Easier to maintain

## 🤝 Contributing

Feel free to:

- Add new pages
- Enhance existing features
- Improve the UI/UX
- Add backend integration
- Implement database storage
- Add more authentication methods

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Support

For issues or questions:

1. Check the Troubleshooting section
2. Inspect browser console (F12) for errors
3. Verify all files are in the correct location
4. Ensure you're using Live Server or a proper HTTP server

## 🎉 Enjoy Building

Happy coding! This multi-page architecture makes it easier to expand and maintain your project. Feel free to customize and extend for your needs!
