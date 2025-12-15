# 🚀 ProjectHub - Quick Reference Guide

## Table of Contents
1. [Quick Start](#quick-start)
2. [Keyboard Shortcuts](#keyboard-shortcuts)
3. [Validation Rules](#validation-rules)
4. [Error Messages](#error-messages)
5. [Toast Notifications](#toast-notifications)
6. [localStorage Keys](#localstorage-keys)
7. [Function Reference](#function-reference)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Open Project
```bash
# Method 1: VS Code Run Task
Ctrl+Shift+B → Select "Run ProjectHub"

# Method 2: Direct Open
Double-click ProjectHub.html

# Method 3: Live Server
Right-click ProjectHub.html → "Open with Live Server"
```

### First Time Setup
1. Open `ProjectHub.html`
2. Click "Join Us"
3. Register with email/password
4. Start creating projects!

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Navigate forward |
| `Shift+Tab` | Navigate backward |
| `Enter` | Activate button/submit form |
| `Space` | Activate button |
| `ESC` | Close modal |
| `Ctrl+Shift+B` | Run project (VS Code) |

---

## Validation Rules

### Title
- **Required**: Yes
- **Minimum**: 10 characters
- **Maximum**: No limit
- **Example**: "My Portfolio Website Project"

### Description
- **Required**: Yes
- **Minimum**: 10 characters
- **Maximum**: No limit
- **Example**: "A comprehensive web application showcasing modern development practices"

### Category
- **Required**: Yes
- **Options**: Web Development, Mobile Apps, AI & Machine Learning, Data Science, Game Development, Desktop Applications

### Technologies
- **Required**: Yes (at least 1)
- **Format**: Comma-separated
- **Example**: "HTML, CSS, JavaScript, React"

### Image
- **Required**: Yes (for new projects)
- **Formats**: JPG, JPEG, PNG, WEBP, GIF
- **Max Size**: 5MB
- **Min Dimensions**: 300x200px
- **Max Dimensions**: 1920px (auto-compressed)

### GitHub URL
- **Required**: No
- **Format**: Must be valid GitHub URL
- **Pattern**: `https://github.com/username/repo`
- **Example**: "https://github.com/johndoe/portfolio"

### Demo URL
- **Required**: No
- **Format**: Must be valid URL
- **Protocols**: http://, https://, file://
- **Example**: "https://demo.example.com"

---

## Error Messages

### Image Upload Errors
```
❌ "File too large. Maximum size is 5MB"
   → Solution: Compress image before upload

❌ "Invalid image format. Please use JPG, PNG, WEBP, GIF, or SVG"
   → Solution: Convert image to supported format

❌ "Image too small. Minimum dimensions: 300x200px"
   → Solution: Use larger image

❌ "Failed to load image. Please try another file"
   → Solution: Check if file is corrupted
```

### Form Validation Errors
```
❌ "Project title must be at least 10 characters"
   → Solution: Make title more descriptive

❌ "Description must be at least 10 characters"
   → Solution: Provide more details

❌ "Please select a category"
   → Solution: Choose category from dropdown

❌ "Please add at least one technology"
   → Solution: List technologies used

❌ "Please enter a valid GitHub repository URL"
   → Solution: Use format: https://github.com/user/repo

❌ "Please enter a valid demo URL"
   → Solution: Check URL format
```

### Authentication Errors
```
❌ "Invalid email or password"
   → Solution: Check credentials or register

❌ "This email is already registered"
   → Solution: Use different email or login

❌ "Password must be at least 6 characters long"
   → Solution: Choose longer password

❌ "Please sign in to access this page"
   → Solution: Login first
```

---

## Toast Notifications

### Success (Green, Auto-dismiss 3s)
```
✅ "Project updated successfully!"
✅ "Project saved!"
✅ "Thank you for rating!"
✅ "Project deleted successfully!"
✅ "Image uploaded successfully!"
✅ "Your project has been published successfully!"
```

### Error (Red, Stay until dismissed)
```
❌ "Error message here"
❌ "File too large. Maximum size is 5MB"
❌ "Invalid image format..."
❌ "Project title must be at least 10 characters"
```

### Info (Blue, Auto-dismiss 3s)
```
ℹ️ "Removed from saved projects"
ℹ️ "Image removed"
```

---

## localStorage Keys

### Projects Database
```javascript
Key: 'projectHubProjects'
Type: Array of Objects
Example:
[
  {
    id: 1234567890,
    title: "Project Title",
    description: "Description...",
    category: "Web",
    technologies: ["HTML", "CSS", "JS"],
    image: "data:image/jpeg;base64,...",
    creator: "John Doe",
    creatorId: 987654,
    views: 10,
    rating: 4.5,
    reviews: 8,
    bookmarks: 3,
    github: "https://github.com/...",
    demo: "https://...",
    dateCreated: "2025-12-15",
    lastUpdated: "2025-12-15"
  }
]
```

### User Accounts
```javascript
Key: 'projectHubUsers'
Type: Array of Objects
Example:
[
  {
    id: 987654,
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    field: "Computer Science",
    bio: "",
    skills: "",
    createdAt: "2025-12-15T10:00:00.000Z"
  }
]
```

### User Bookmarks
```javascript
Key: 'projectHubBookmarks_[userId]'
Type: Array of Numbers
Example: [1234567890, 9876543210]
```

### Current Session
```javascript
Key: 'currentUser' (sessionStorage)
Type: Object
Example:
{
  id: 987654,
  email: "john@example.com",
  name: "John Doe",
  field: "Computer Science",
  bio: "",
  skills: ""
}
```

---

## Function Reference

### Core Functions

#### Project Operations
```javascript
handleProjectUpload(event)
// Creates new project with validation
// Validates: title, description, category, technologies, image, GitHub URL, demo URL
// Saves to localStorage and refreshes display

handleProjectEdit(event)
// Updates existing project
// Same validation as upload
// Updates lastUpdated timestamp

deleteProject(projectId)
// Removes project from database
// Removes from bookmarks
// Saves changes to localStorage

viewProjectDetails(projectId)
// Opens modal with project details
// Increments view counter
// Displays rating, technologies, links
```

#### Image Management
```javascript
handleImageSelect(event, mode)
// Handles file input change
// mode: 'upload' or 'edit'

processImageFile(file, mode)
// Validates file type, size, dimensions
// Reads file using FileReader
// Triggers compression

compressImage(img, fileType, callback)
// Compresses image using Canvas API
// Max dimensions: 1920px
// Quality: 85%
// Returns Base64 string

displayImagePreview(base64, filename, filesize, width, height, mode)
// Shows image preview in modal
// Displays file information
// Shows action buttons

resetImagePreview(mode)
// Clears preview to default state
// Removes image data
```

#### Validation
```javascript
isValidGitHubUrl(url)
// Returns: boolean
// Pattern: https://github.com/username/repo

isValidUrl(url)
// Returns: boolean
// Accepts: http://, https://, file://

validateTitle(title)
// Returns: {valid: boolean, message: string}
// Minimum: 10 characters

validateDescription(description)
// Returns: {valid: boolean, message: string}
// Minimum: 10 characters

validateTechnologies(techString)
// Returns: {valid: boolean, technologies: array, message: string}
// Minimum: 1 technology required
```

#### Modal Management
```javascript
openModal(modalId)
// Opens modal by ID
// Sets aria-hidden="false"
// Focuses first input

closeModal(modalId)
// Closes modal by ID
// Sets aria-hidden="true"
// Returns focus to trigger element
```

#### Data Persistence
```javascript
saveProjectsToStorage()
// Saves projectDatabase to localStorage
// Key: 'projectHubProjects'

loadProjectsFromStorage()
// Loads projects from localStorage
// Merges with default data
// Avoids duplicates

saveCurrentSession(user)
// Saves user to sessionStorage
// Key: 'currentUser'

loadCurrentSession()
// Loads user from sessionStorage
// Returns: user object or null
```

#### UI Functions
```javascript
showToast(message, type)
// type: 'success', 'error', 'info'
// Auto-dismiss: 3 seconds for success/info
// Manual dismiss: error toasts

renderProjectGrid()
// Renders all projects on browse page
// Filters by search/category if active

renderUserProjects()
// Renders current user's projects
// Only shows projects created by user

createProjectCard(project)
// Generates HTML for project card
// Returns: HTML string
```

---

## Troubleshooting

### Problem: Projects not appearing

**Cause**: localStorage not loading
**Solution**:
1. Open DevTools (F12)
2. Go to Application → localStorage
3. Check if `projectHubProjects` exists
4. Refresh page

### Problem: Image upload fails

**Possible Causes**:
- File too large (> 5MB)
- Invalid format (not JPG/PNG/WEBP/GIF)
- Image too small (< 300x200px)
- Corrupted file

**Solution**:
1. Check file size
2. Convert to supported format
3. Use larger image
4. Try different file

### Problem: Can't delete project

**Cause**: Project not owned by current user
**Solution**: Only owner can delete projects

### Problem: Validation errors

**Solution**: Check validation rules above and ensure:
- Title ≥ 10 characters
- Description ≥ 10 characters
- Category selected
- At least 1 technology
- Valid URLs (if provided)
- Image uploaded

### Problem: Session lost after refresh

**Cause**: sessionStorage cleared
**Solution**: Login again

### Problem: Modal won't close

**Solutions**:
1. Press ESC key
2. Click outside modal
3. Click X button
4. Refresh page

### Problem: Toast notifications not showing

**Cause**: Container missing
**Solution**: Check if `<div id="toastContainer">` exists in HTML

### Problem: Image not compressing

**Cause**: Browser doesn't support Canvas API
**Solution**: Use modern browser (Chrome 90+, Firefox 88+, Safari 14+)

### Problem: localStorage full

**Cause**: Too many large images
**Solution**:
1. Delete old projects
2. Use smaller images
3. Clear localStorage and start fresh

### Clear localStorage
```javascript
// Open DevTools Console and run:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

---

## Browser Console Commands

### Check Projects
```javascript
// Get all projects
JSON.parse(localStorage.getItem('projectHubProjects'))

// Count projects
JSON.parse(localStorage.getItem('projectHubProjects')).length

// Get current user
JSON.parse(sessionStorage.getItem('currentUser'))

// Get user's bookmarks
JSON.parse(localStorage.getItem('projectHubBookmarks_' + currentUser.id))
```

### Debug localStorage Size
```javascript
// Check total localStorage usage
let total = 0;
for (let key in localStorage) {
  if (localStorage.hasOwnProperty(key)) {
    total += localStorage[key].length;
  }
}
console.log('Total:', (total / 1024).toFixed(2), 'KB');
```

### Manually Add Project
```javascript
let projects = JSON.parse(localStorage.getItem('projectHubProjects')) || [];
projects.push({
  id: Date.now(),
  title: "Test Project Title Here",
  description: "Test description for debugging",
  category: "Web",
  technologies: ["HTML", "CSS", "JS"],
  image: null,
  creator: "Test User",
  creatorId: 12345,
  views: 0,
  rating: 0,
  reviews: 0,
  bookmarks: 0,
  github: "",
  demo: "",
  dateCreated: new Date().toISOString().split('T')[0],
  lastUpdated: new Date().toISOString().split('T')[0]
});
localStorage.setItem('projectHubProjects', JSON.stringify(projects));
location.reload();
```

---

## Quick Fixes

### Reset Everything
```javascript
// Clear all data and refresh
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Force Logout
```javascript
sessionStorage.removeItem('currentUser');
location.reload();
```

### Remove Specific Project
```javascript
let projects = JSON.parse(localStorage.getItem('projectHubProjects'));
projects = projects.filter(p => p.id !== PROJECT_ID_HERE);
localStorage.setItem('projectHubProjects', JSON.stringify(projects));
location.reload();
```

### Fix Broken Image
```javascript
let projects = JSON.parse(localStorage.getItem('projectHubProjects'));
let project = projects.find(p => p.id === PROJECT_ID_HERE);
project.image = null; // or new Base64 string
localStorage.setItem('projectHubProjects', JSON.stringify(projects));
location.reload();
```

---

## File Locations

```
ProjectHub/
├── ProjectHub.html          # Landing page - Start here
├── browse.html             # Browse all projects
├── dashboard.html          # User statistics
├── mywork.html            # Manage your projects (MAIN PAGE)
├── account.html           # Profile settings
├── app.js                # Main logic (1,133 lines)
├── data.js               # Sample data
├── styles.css            # All styles (1,030 lines)
├── TESTING_GUIDE.md      # How to test (2,000+ lines)
├── IMPLEMENTATION_COMPLETE.md  # Verification doc
└── QUICK_REFERENCE.md    # This file
```

---

## Tips

### For Best Performance
1. **Compress images** before upload
2. **Clear old projects** periodically
3. **Use modern browser** (Chrome/Firefox latest)
4. **Don't store huge images** (keep under 2MB)

### For Best UX
1. **Write descriptive titles** (≥10 characters)
2. **Add detailed descriptions**
3. **List all technologies** used
4. **Include GitHub links** for credibility
5. **Add demo URLs** when available

### For Developers
1. **Check DevTools Console** for errors
2. **Use localStorage inspector** in DevTools
3. **Test on multiple browsers**
4. **Validate HTML** before deploying
5. **Run accessibility tests** (WAVE, axe)

---

## Contact & Support

### Documentation
- **Testing Guide**: `TESTING_GUIDE.md`
- **Implementation**: `IMPLEMENTATION_COMPLETE.md`
- **Image System**: `IMAGE_MANAGEMENT_GUIDE.md`
- **Button Features**: `BUTTON_FUNCTIONALITY_GUIDE.md`

### Need Help?
1. Check this Quick Reference
2. Read TESTING_GUIDE.md
3. Check browser console for errors
4. Clear localStorage and try again
5. Create GitHub issue

---

**Quick Reference Guide v2.0.0**
*Last Updated: December 15, 2025*

**🚀 Happy Building!**
